import pymysql
import os

# Configure PyMySQL as MySQLdb
pymysql.install_as_MySQLdb()

print("Testing PyMySQL connection to Azure MySQL with Baltimore certificate...")

try:
    connection = pymysql.connect(
        host='sql7802231.mysql.database.azure.com',
        user='sql7802230',
        password='Mypassword1',
        database='sql7802231',
        port=3306,
        ssl={'ca': 'BaltimoreCyberTrustRoot.crt.pem'},
    )
    
    print("✅ Connection successful with SSL verification!")
    
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    
    print(f"\nTables in database: {len(tables)}")
    for table in tables:
        print(f"  - {table[0]}")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
