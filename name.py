import os
import json

# 设置文件夹路径
folder_path = 'pages'

# 获取文件夹内所有.md文件的文件名
file_names = []
for file in os.listdir(folder_path):
    if file.endswith('.md'):
        file_names.append(file)

# 把文件名作为键，"(文件名)"作为值，保存为字典
file_dict = {}
for name in file_names:
    file_dict[name] = f'({name})'

# 把字典保存为json格式并写入文件
with open('obj.json', 'w') as f:
    json.dump(file_dict, f)