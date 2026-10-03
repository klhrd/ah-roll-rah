import os

start_id=int(input("start id: \t"))
end_id=int(input("end id: \t"))
output_dir="levels"

os.makedirs(output_dir,exist_ok=True)

for level_id in range(start_id,end_id+1,1):
    content=f"""
{{
    "id": {level_id},
    "name": "level-{level_id}",
    "speedZ": 0.1,
    "difficulty": 1,
    "cols": 5,
    "map": 
    [
        [ 1, 1, 1, 1, 1],
        [ 9, 9, 9, 9, 9]
    ]
}}
"""
    file_path=os.path.join(output_dir,f"level_{level_id}.json")
    with open(file_path,"w",encoding="utf-8")as f:
        f.write(content)

print("done")
