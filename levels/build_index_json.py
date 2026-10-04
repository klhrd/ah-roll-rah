import os

start_id=int(input("start id: \t"))
end_id=int(input("end id: \t"))
output_dir="levels"

os.makedirs(output_dir,exist_ok=True)

content="[\n"

for level_id in range(start_id,end_id+1,1):
    content+=f"    \"level_{level_id}.json\""
    if level_id==end_id:
        content+="\n"
    else:
        content+=",\n"
content+="]"
    
file_path=os.path.join(output_dir,f"index.json")
with open(file_path,"w",encoding="utf-8")as f:
    f.write(content)

print("done")
