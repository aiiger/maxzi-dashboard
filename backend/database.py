"""
MAXZI Analytics Database Setup
Creates SQLite database with sample data
"""

import sqlite3
from datetime import datetime, timedelta
import random

DATABASE = r'Y:\Maxzi Analytics v2\New iteration\maxzi-dashboard\backend\database_CORRECT_20251024_074959.sqlite'

def init_database():
    """Initialize database with schema and sample data"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Drop existing tables
    cursor.execute('DROP TABLE IF EXISTS daily_performance')
    cursor.execute('DROP TABLE IF EXISTS location_performance')
    cursor.execute('DROP TABLE IF EXISTS orders')
    
    # Create tables
    cursor.execute('''
        CREATE TABLE daily_performance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            location_id INTEGER,
            revenue REAL,
            orders INTEGER,
            aov REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE location_performance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_id INTEGER NOT NULL,
            location_name TEXT NOT NULL,
            location_type TEXT NOT NULL,
            date DATE NOT NULL,
            revenue REAL,
            order_id TEXT,
            aov REAL,
            rating REAL,
            gmb_views INTEGER,
            gmb_calls INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            location_id INTEGER,
            platform TEXT,
            date DATE,
            revenue REAL,
            aov REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample data based on MAXZI reports
    locations = [
        (1, 'Al Quoz', 'restaurant', 61972, 510, 121.51, 4.7, 7149, 262),
        (2, 'Circle Mall (JVC)', 'restaurant', 72131, 628, 114.86, 4.8, 1517, 27),
        (3, 'Yas Mall', 'restaurant', 13543, 113, 119.85, 4.8, 3859, 95),
        (4, 'Al Furjan', 'restaurant', 26462, 243, 108.90, 4.9, 1464, 17),
        (5, 'Food Truck', 'restaurant', 13032, 118, 110.44, 4.6, 1384, 112),
        (6, 'Al Jada (Sharjah)', 'franchise', 28437, 247, 115.13, 4.7, 1898, 159),
        (7, 'Al Jimi Mall', 'franchise', 67098, 639, 105.00, 4.4, 897, 164),
        (8, 'Avenue Mall', 'franchise', 28437, 247, 115.13, 4.9, 1935, 60)
    ]
    
    # Insert location performance
    for loc_id, name, loc_type, revenue, orders, aov, rating, views, calls in locations:
        # Create data for last 7 days
        for i in range(7):
            date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
            daily_revenue = revenue / 7 * random.uniform(0.8, 1.2)
            daily_orders = int(orders / 7 * random.uniform(0.8, 1.2))
            
            cursor.execute('''
                INSERT INTO location_performance 
                (location_id, location_name, location_type, date, revenue, order_id, aov, rating, gmb_views, gmb_calls)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (loc_id, name, loc_type, date, daily_revenue, f'ORD{loc_id}{i}', aov, rating, views//7, calls//7))
            
            # Insert into daily_performance
            cursor.execute('''
                INSERT INTO daily_performance (date, location_id, revenue, orders, aov)
                VALUES (?, ?, ?, ?, ?)
            ''', (date, loc_id, daily_revenue, daily_orders, aov))
    
    # Insert platform orders
    platforms = [
        ('Deliveroo', 1809, 208164),
        ('Talabat', 1936, 207357),
        ('Noon Food', 136, 13704)
    ]
    
    order_counter = 1
    for platform, total_orders, total_revenue in platforms:
        aov = total_revenue / total_orders
        for i in range(total_orders):
            date = (datetime.now() - timedelta(days=random.randint(0, 6))).strftime('%Y-%m-%d')
            location_id = random.randint(1, 8)
            order_revenue = aov * random.uniform(0.7, 1.3)
            
            cursor.execute('''
                INSERT INTO orders (order_id, location_id, platform, date, revenue, aov)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (f'{platform[:3].upper()}{order_counter:05d}', location_id, platform, date, order_revenue, aov))
            order_counter += 1
    
    conn.commit()
    conn.close()
    
    print("✅ Database initialized successfully!")
    print(f"📊 Sample data loaded for {len(locations)} locations")
    print(f"🍜 {sum(p[1] for p in platforms)} orders across 3 platforms")

if __name__ == '__main__':
    init_database()
