#!/usr/bin/env python3
"""
Test script to verify SQL file loading works correctly
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.load_sql_file import load_sql

def test_sql_loading():
    """Test loading SQL files"""
    try:
        # Test loading total_profit.sql
        sql_content = load_sql("app/sql/total_profit.sql")
        print("✅ Successfully loaded total_profit.sql")
        print(f"Content length: {len(sql_content)} characters")
        
        # Test loading asset_allocation.sql
        sql_content = load_sql("app/sql/asset_allocation.sql")
        print("✅ Successfully loaded asset_allocation.sql")
        print(f"Content length: {len(sql_content)} characters")
        
        # Test loading portfolio_profit.sql
        sql_content = load_sql("app/sql/portfolio_profit.sql")
        print("✅ Successfully loaded portfolio_profit.sql")
        print(f"Content length: {len(sql_content)} characters")
        
        # Test loading prev_total_profit.sql
        sql_content = load_sql("app/sql/prev_total_profit.sql")
        print("✅ Successfully loaded prev_total_profit.sql")
        print(f"Content length: {len(sql_content)} characters")
        
        print("\n🎉 All SQL files loaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error loading SQL files: {str(e)}")
        return False

if __name__ == "__main__":
    test_sql_loading() 