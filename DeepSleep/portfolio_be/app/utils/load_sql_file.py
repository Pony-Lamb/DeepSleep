import os

def load_sql(filepath):
    # Get the directory of the current file (utils directory)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to app directory, then construct the full path
    app_dir = os.path.dirname(current_dir)
    full_path = os.path.join(app_dir, filepath.replace('app/', ''))
    
    with open(full_path, 'r', encoding='utf-8') as f:
        return f.read()
