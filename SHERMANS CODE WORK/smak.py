val = input("Enter mode: (1) Restock or (0) Initial\n")
if val == '1':
    print(f"Entering Restock Mode\n")
elif val == '0':
    print(f'Entering Initial Mode\n')
else:
    print(f'{val} is not a valid mode! Choose (1) restock or (2) initial\n')
    val = input("Enter mode: (1) Restock or (2) Initial\n")