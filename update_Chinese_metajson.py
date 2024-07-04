import os
import json

root_directory = './pages1/'
config = {
    "need_create_meta": 1,
    "need_replace_values": 0
}

def create_meta_json(directory):
    meta_data = {}
    
    # 遍历当前目录下的所有文件和子文件夹
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        print(item)
        if os.path.isfile(item_path):
            # 处理 .md 和 .mdx 文件
            if item_path.endswith('.md') or item_path.endswith('.mdx'):
                base_name = os.path.splitext(item)[0]
                capitalized_name = base_name.capitalize()
                meta_data[base_name] = f"({capitalized_name})"  # 使用 base_name 作为键
        
        elif os.path.isdir(item_path):
            # 处理子文件夹
            capitalized_name = item.capitalize()
            print(os.path.isdir(item_path))
            meta_data[item] = f"({capitalized_name})"  # 使用文件夹名作为键
    
    # 写入 _meta.json 文件
    meta_file_path = os.path.join(directory, '_meta.json')
    with open(meta_file_path, 'w', encoding='utf-8') as meta_file:
        json.dump(meta_data, meta_file, ensure_ascii=False, indent=4)

def aggregate_meta_json(directory, aggregated_data):
    for root, dirs, files in os.walk(directory):
        if '_meta.json' in files:
            meta_file_path = os.path.join(root, '_meta.json')
            with open(meta_file_path, 'r', encoding='utf-8') as meta_file:
                data = json.load(meta_file)
                aggregated_data.update(data)

def main():
    for root, dirs, files in os.walk(root_directory):
        for dir_name in dirs:
            sub_dir_path = os.path.join(root, dir_name)
            create_meta_json(sub_dir_path)
    
    aggregated_data = {}
    aggregate_meta_json(root_directory, aggregated_data)
    
    aggregated_meta_file_path = os.path.join(root_directory, 'aggregated_meta.json')
    with open(aggregated_meta_file_path, 'w', encoding='utf-8') as aggregated_meta_file:
        json.dump(aggregated_data, aggregated_meta_file, ensure_ascii=False, indent=4)


import os
import json

def read_json_file(file_path):
    """读取并返回 JSON 文件的内容。"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def write_json_file(file_path, data):
    """将数据写入 JSON 文件。"""
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def replace_values(directory):
    """用 aggregated_meta.json 中的值替换所有 _meta.json 文件中的对应值。"""
    aggregated_meta_path = os.path.join(directory, 'aggregated_meta.json')
    if not os.path.exists(aggregated_meta_path):
        raise FileNotFoundError(f"{aggregated_meta_path} 文件不存在。")

    aggregated_meta = read_json_file(aggregated_meta_path)

    # 遍历目录以找到所有 _meta.json 文件
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('_meta.json') and file != 'aggregated_meta.json':
                file_path = os.path.join(root, file)
                meta_data = read_json_file(file_path)

                # 替换 meta_data 中的值为 aggregated_meta 中的值
                for key in meta_data:
                    if key in aggregated_meta:
                        meta_data[key] = aggregated_meta[key]

                # 保存更新后的数据回到 _meta.json 文件
                write_json_file(file_path, meta_data)
    


if __name__ == "__main__":
    if(config['need_create_meta']):
        main()
    elif(config['need_replace_values']):
        replace_values(root_directory)