"""
Test database connection with Azure credentials
"""
import os
os.environ['DB_NAME'] = 'sql7802231'
os.environ['DB_USER'] = 'sql7802230'
os.environ['DB_PASSWORD'] = 'Mypassword1'
os.environ['DB_HOST'] = 'sql7802231.mysql.database.azure.com'
os.environ['DEBUG'] = 'True'

try:
    import MySQLdb
    print("✅ mysqlclient installed")
    
    # Try to connect
    conn = MySQLdb.connect(
        host='sql7802231.mysql.database.azure.com',
        user='sql7802230',
        passwd='Mypassword1',
        db='sql7802231',
        port=3306,
        ssl={'ssl': True}
    )
    print("✅ MySQL connection successful!")
    
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"✅ Tables in database: {len(tables)}")
    for table in tables:
        print(f"   - {table[0]}")
    
    conn.close()
    
except ImportError as e:
    print(f"❌ mysqlclient not installed: {e}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
