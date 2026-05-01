import sqlite3
import json

conn = sqlite3.connect('database.sqlite')
cursor = conn.cursor()
cursor.execute('SELECT element, COUNT(*) FROM monsters GROUP BY element')
rows = cursor.fetchall()
print(rows)
conn.close()
