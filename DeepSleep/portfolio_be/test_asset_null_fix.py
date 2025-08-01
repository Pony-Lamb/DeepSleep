#!/usr/bin/env python3
"""
测试asset null问题的修复
"""

import requests
import json

def test_asset_detail_endpoint():
    """测试资产详情API端点"""
    base_url = "http://localhost:5000/api/v1"
    
    # 测试无效的asset_id
    test_cases = [
        "null",
        "undefined", 
        "",
        None
    ]
    
    print("=== 测试资产详情API端点 ===")
    
    for asset_id in test_cases:
        try:
            if asset_id is None:
                url = f"{base_url}/asset/"
            else:
                url = f"{base_url}/asset/{asset_id}"
            
            print(f"\n测试 asset_id: {asset_id}")
            print(f"URL: {url}")
            
            response = requests.get(url)
            print(f"状态码: {response.status_code}")
            
            if response.status_code == 400:
                print("✅ 正确返回400错误 - 无效的asset_id")
            elif response.status_code == 404:
                print("✅ 正确返回404错误 - 资产未找到")
            elif response.status_code == 500:
                print("❌ 返回500错误 - 需要修复")
                print(f"响应内容: {response.text}")
            else:
                print(f"⚠️ 意外的状态码: {response.status_code}")
                print(f"响应内容: {response.text}")
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")

def test_portfolio_details_endpoint():
    """测试投资组合详情API端点"""
    base_url = "http://localhost:5000/api/v1"
    
    print("\n=== 测试投资组合详情API端点 ===")
    
    # 测试一个存在的投资组合
    portfolio_name = "My Portfolio"  # 假设这个投资组合存在
    
    try:
        url = f"{base_url}/portfolio/details?name={portfolio_name}"
        print(f"URL: {url}")
        
        response = requests.get(url)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ 成功获取投资组合详情")
            print(f"持仓数量: {data.get('len', 0)}")
            
            # 检查是否有无效的asset_id
            holdings = data.get('data', [])
            invalid_holdings = [h for h in holdings if not h.get('asset_id') or h.get('asset_id') == 'null']
            
            if invalid_holdings:
                print(f"⚠️ 发现 {len(invalid_holdings)} 个无效的asset_id")
                for holding in invalid_holdings:
                    print(f"  - asset_id: {holding.get('asset_id')}, quantity: {holding.get('quantity')}")
            else:
                print("✅ 所有持仓都有有效的asset_id")
                
        elif response.status_code == 400:
            print("⚠️ 投资组合不存在或为空")
        else:
            print(f"❌ 意外的状态码: {response.status_code}")
            print(f"响应内容: {response.text}")
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")

def main():
    """主测试函数"""
    print("开始测试asset null问题的修复...")
    
    # 测试资产详情端点
    test_asset_detail_endpoint()
    
    # 测试投资组合详情端点
    test_portfolio_details_endpoint()
    
    print("\n测试完成!")

if __name__ == "__main__":
    main() 