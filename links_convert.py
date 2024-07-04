import os
import re

def generate_file_dict(root_folder):
    file_dict = {}
    root_folder_abs = os.path.abspath(root_folder)
    
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith(('.md', '.mdx')):
                key = filename
                abs_path = os.path.abspath(os.path.join(dirpath, filename))
                relative_path = os.path.relpath(abs_path, root_folder_abs).replace('\\', '/')
                file_dict[key] = "/"+relative_path
    print(file_dict)            
    return file_dict

def replace_links_in_file(file_path, file_dict):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    modified_lines = []
    link_pattern = re.compile(r'\[(.*?)\]\((.*?\.(mdx?))\)')

    for line in lines:
        new_line = line
        matches = link_pattern.findall(line)
        for match in matches:
            if len(match) == 2:
                text, link = match
            else:
                text, link, _ = match
            link_filename = os.path.basename(link)
            if link_filename in file_dict:
                new_link = file_dict[link_filename]
                new_line = new_line.replace(f'({link})', f'({new_link})')
        modified_lines.append(new_line)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(modified_lines)

def process_folder(root_folder):
    file_dict = generate_file_dict(root_folder)
    root_folder_abs = os.path.abspath(root_folder)

    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith(('.md', '.mdx')):
                absolute_file_path = os.path.join(dirpath, filename)
                replace_links_in_file(absolute_file_path, file_dict)


if __name__ == "__main__":
    root_folder = "pages"
    process_folder(root_folder)