"""
MAXZI Analytics Database Setup
Creates SQLite database with sample data
"""

import sqlite3
from datetime import datetime, timedelta
import random

DATABASE = 'maxzi_analytics.db'

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
            platform TEXT NOT NULL,
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
    # Format: (location_id, name, type, platform, revenue, orders, aov, rating, gmb_views, gmb_calls)
    locations = [
        # DELIVEROO LOCATIONS (13 total: 5 dark kitchen + 8 regular)
        # Smash and Sear - Dark Kitchen Locations (5)
        (1, 'Smash and Sear - Al Quoz', 'dark_kitchen', 'Deliveroo', 45000, 380, 118.42, 4.6, 0, 0),
        (2, 'Smash and Sear - JVC', 'dark_kitchen', 'Deliveroo', 52000, 440, 118.18, 4.7, 0, 0),
        (3, 'Smash and Sear - Dubai Marina', 'dark_kitchen', 'Deliveroo', 48000, 405, 118.52, 4.6, 0, 0),
        (4, 'Smash and Sear - Business Bay', 'dark_kitchen', 'Deliveroo', 50000, 425, 117.65, 4.7, 0, 0),
        (5, 'Smash and Sear - Jumeirah', 'dark_kitchen', 'Deliveroo', 46000, 390, 117.95, 4.6, 0, 0),

        # Regular Deliveroo Locations (8)
        (6, 'Al Quoz', 'restaurant', 'Deliveroo', 61972, 510, 121.51, 4.7, 7149, 262),
        (7, 'Circle Mall JVC', 'restaurant', 'Deliveroo', 72131, 628, 114.86, 4.8, 1517, 27),
        (8, 'Yas Mall', 'restaurant', 'Deliveroo', 55000, 465, 118.28, 4.8, 3859, 95),
        (9, 'Al Furjan', 'restaurant', 'Deliveroo', 48500, 410, 118.29, 4.7, 1464, 17),
        (10, 'Dubai Mall', 'restaurant', 'Deliveroo', 68000, 575, 118.26, 4.8, 8500, 180),
        (11, 'Mall of Emirates', 'restaurant', 'Deliveroo', 65000, 550, 118.18, 4.7, 6200, 145),
        (12, 'City Walk', 'restaurant', 'Deliveroo', 58000, 490, 118.37, 4.8, 4500, 120),
        (13, 'Mirdif City Centre', 'restaurant', 'Deliveroo', 52000, 440, 118.18, 4.7, 3200, 85),

        # TALABAT LOCATIONS (8)
        (14, 'Al Quoz', 'restaurant', 'Talabat', 58000, 520, 111.54, 4.6, 7149, 262),
        (15, 'JVC', 'restaurant', 'Talabat', 62000, 560, 110.71, 4.7, 1517, 27),
        (16, 'Al Barsha', 'restaurant', 'Talabat', 54000, 490, 110.20, 4.6, 2800, 65),
        (17, 'Motor City', 'restaurant', 'Talabat', 48000, 435, 110.34, 4.7, 1900, 42),
        (18, 'Arabian Ranches', 'restaurant', 'Talabat', 51000, 460, 110.87, 4.8, 2200, 58),
        (19, 'Springs', 'restaurant', 'Talabat', 49000, 445, 110.11, 4.6, 2100, 48),
        (20, 'Meadows', 'restaurant', 'Talabat', 47000, 425, 110.59, 4.7, 1800, 39),
        (21, 'Green Community', 'restaurant', 'Talabat', 45000, 410, 109.76, 4.6, 1600, 35),

        # SAPAAD LOCATIONS - Dine-in (5)
        (22, 'Al Quoz Flagship', 'restaurant', 'Sapaad', 85000, 650, 130.77, 4.8, 7149, 262),
        (23, 'JVC Dine-in', 'restaurant', 'Sapaad', 78000, 600, 130.00, 4.7, 1517, 27),
        (24, 'Dubai Mall Food Court', 'restaurant', 'Sapaad', 92000, 710, 129.58, 4.8, 8500, 180),
        (25, 'Marina Walk', 'restaurant', 'Sapaad', 88000, 680, 129.41, 4.8, 5500, 125),
        (26, 'City Walk Terrace', 'restaurant', 'Sapaad', 82000, 630, 130.16, 4.7, 4500, 120)
    ]
    
    # Insert location performance
    for loc_id, name, loc_type, platform, revenue, orders, aov, rating, views, calls in locations:
        # Create data for last 7 days
        for i in range(7):
            date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
            daily_revenue = revenue / 7 * random.uniform(0.8, 1.2)
            daily_orders = int(orders / 7 * random.uniform(0.8, 1.2))

            cursor.execute('''
                INSERT INTO location_performance
                (location_id, location_name, location_type, platform, date, revenue, order_id, aov, rating, gmb_views, gmb_calls)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (loc_id, name, loc_type, platform, date, daily_revenue, f'ORD{loc_id}{i}', aov, rating, views//7, calls//7))
            
            # Insert into daily_performance
            cursor.execute('''
                INSERT INTO daily_performance (date, location_id, revenue, orders, aov)
                VALUES (?, ?, ?, ?, ?)
            ''', (date, loc_id, daily_revenue, daily_orders, aov))
    
    # Insert platform orders
    # Platform location ranges: Deliveroo (1-13), Talabat (14-21), Sapaad (22-26)
    platform_configs = [
        ('Deliveroo', 3500, 420000, 1, 13),   # 13 locations
        ('Talabat', 3200, 350000, 14, 21),    # 8 locations
        ('Sapaad', 2500, 325000, 22, 26)      # 5 locations
    ]

    order_counter = 1
    for platform, total_orders, total_revenue, loc_start, loc_end in platform_configs:
        aov = total_revenue / total_orders
        for i in range(total_orders):
            date = (datetime.now() - timedelta(days=random.randint(0, 6))).strftime('%Y-%m-%d')
            location_id = random.randint(loc_start, loc_end)
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
    print(f"   - Deliveroo: 13 locations (5 Smash and Sear dark kitchens + 8 regular)")
    print(f"   - Talabat: 8 locations")
    print(f"   - Sapaad: 5 locations")
    print(f"🍜 {sum(p[1] for p in platform_configs)} orders across 3 platforms")

if __name__ == '__main__':
    init_database()
