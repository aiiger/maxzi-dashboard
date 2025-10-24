"""
MAXZI Analytics - Data Tracking System
Tracks data freshness and missing reports for AI chatbot intelligence
"""

import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

DATABASE = 'database_CORRECT_20251024_074959.sqlite'

# Platform report configurations
PLATFORM_REPORTS = {
    'deliveroo': {
        'financial_reports': {
            'order_history': {
                'frequency': 'daily',
                'file_format': 'CSV',
                'expected_columns': ['date_submitted', 'order_number', 'subtotal', 'commission', 'location_name'],
                'description': 'Daily order transactions with revenue and commission data',
                'table': 'deliveroo_orders',
                'date_column': 'date_submitted'
            }
        },
        'operational_reports': {
            'delivery_performance': {
                'frequency': 'weekly',
                'file_format': 'CSV',
                'expected_columns': ['delivery_duration_minutes', 'order_status'],
                'description': 'Delivery times and operational metrics',
                'table': 'deliveroo_orders',
                'date_column': 'date_submitted'
            }
        }
    },
    'talabat': {
        'financial_reports': {
            'transaction_history': {
                'frequency': 'daily',
                'file_format': 'CSV/API',
                'expected_columns': ['transaction_date', 'order_value', 'commission_amount', 'order_count'],
                'description': 'Daily transactions with order values and commissions',
                'table': 'order_transactions',
                'date_column': 'transaction_date',
                'filter': "platform = 'talabat'"
            }
        },
        'operational_reports': {
            'preparation_time': {
                'frequency': 'monthly',
                'file_format': 'Excel',
                'expected_columns': ['avg_prep_time_minutes', 'avoidable_delay_count', 'location_name'],
                'description': 'Kitchen preparation times and delay metrics',
                'table': 'talabat_preparation_time',
                'date_column': 'month'
            },
            'order_rejections': {
                'frequency': 'monthly',
                'file_format': 'Excel',
                'description': 'Rejected orders and reasons',
                'table': 'talabat_order_rejections',
                'date_column': 'month'
            }
        }
    },
    'sapaad': {
        'financial_reports': {
            'location_sales': {
                'frequency': 'daily',
                'file_format': 'CSV/Database Export',
                'expected_columns': ['sale_date', 'location_name', 'total_sales', 'order_count', 'avg_per_check'],
                'description': 'Daily sales by location from POS system',
                'table': 'sapaad_location_sales',
                'date_column': 'sale_date'
            }
        },
        'operational_reports': {
            'payment_methods': {
                'frequency': 'daily',
                'file_format': 'CSV/Database Export',
                'expected_columns': ['payment_visa', 'payment_mastercard', 'payment_cash', 'payment_qlub'],
                'description': 'Payment method breakdown by day',
                'table': 'sapaad_location_sales',
                'date_column': 'sale_date'
            }
        }
    },
    'noon': {
        'financial_reports': {
            'transaction_history': {
                'frequency': 'monthly',
                'file_format': 'CSV/API',
                'expected_columns': ['transaction_date', 'order_value', 'order_count'],
                'description': 'Monthly transaction summary',
                'table': 'order_transactions',
                'date_column': 'transaction_date',
                'filter': "platform = 'noon'"
            }
        },
        'operational_reports': {
            'order_status': {
                'frequency': 'monthly',
                'file_format': 'CSV',
                'description': 'Order status tracking',
                'table': 'order_transactions',
                'date_column': 'transaction_date',
                'filter': "platform = 'noon'"
            }
        }
    }
}

def get_data_status() -> Dict:
    """
    Get current data status for all platforms
    Returns dict with platform status and missing data
    """
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    today = datetime.now().date()
    status = {
        'check_date': str(today),
        'platforms': {}
    }

    # Check Deliveroo
    cursor.execute("""
        SELECT MAX(date_submitted) as last_date, COUNT(*) as total_orders
        FROM deliveroo_orders
        WHERE order_status = 'Completed';
    """)
    d_data = cursor.fetchone()
    if d_data[0]:
        last_date = datetime.strptime(d_data[0], '%Y-%m-%d').date()
        days_missing = (today - last_date).days
        status['platforms']['deliveroo'] = {
            'last_updated': str(last_date),
            'days_behind': days_missing,
            'total_orders': d_data[1],
            'status': 'current' if days_missing <= 1 else 'outdated',
            'missing_dates': [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d')
                             for i in range(days_missing)],
            'reports_needed': get_needed_reports('deliveroo', last_date, today)
        }

    # Check Talabat
    cursor.execute("""
        SELECT MAX(transaction_date) as last_date, SUM(order_count) as total_orders
        FROM order_transactions
        WHERE platform = 'talabat';
    """)
    t_data = cursor.fetchone()
    if t_data[0]:
        last_date = datetime.strptime(t_data[0], '%Y-%m-%d').date()
        days_missing = (today - last_date).days
        status['platforms']['talabat'] = {
            'last_updated': str(last_date),
            'days_behind': days_missing,
            'total_orders': int(t_data[1]) if t_data[1] else 0,
            'status': 'current' if days_missing <= 1 else 'outdated',
            'missing_dates': [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d')
                             for i in range(days_missing)],
            'reports_needed': get_needed_reports('talabat', last_date, today)
        }

    # Check SAPAAD
    cursor.execute("""
        SELECT MAX(sale_date) as last_date, SUM(order_count) as total_orders
        FROM sapaad_location_sales;
    """)
    s_data = cursor.fetchone()
    if s_data[0]:
        last_date = datetime.strptime(s_data[0], '%Y-%m-%d').date()
        days_missing = (today - last_date).days
        status['platforms']['sapaad'] = {
            'last_updated': str(last_date),
            'days_behind': days_missing,
            'total_orders': int(s_data[1]) if s_data[1] else 0,
            'status': 'current' if days_missing <= 1 else 'outdated',
            'missing_dates': [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d')
                             for i in range(days_missing)],
            'reports_needed': get_needed_reports('sapaad', last_date, today)
        }

    # Check Noon
    cursor.execute("""
        SELECT MAX(transaction_date) as last_date, SUM(order_count) as total_orders
        FROM order_transactions
        WHERE platform = 'noon';
    """)
    n_data = cursor.fetchone()
    if n_data[0]:
        # Handle month-only dates
        try:
            last_date = datetime.strptime(n_data[0], '%Y-%m-%d').date()
        except ValueError:
            last_date = datetime.strptime(n_data[0] + '-01', '%Y-%m-%d').date()

        days_missing = (today - last_date).days
        status['platforms']['noon'] = {
            'last_updated': str(last_date),
            'days_behind': days_missing,
            'total_orders': int(n_data[1]) if n_data[1] else 0,
            'status': 'current' if days_missing <= 30 else 'outdated',  # Monthly updates
            'missing_dates': 'Monthly report needed' if days_missing > 30 else 'Current',
            'reports_needed': get_needed_reports('noon', last_date, today)
        }

    conn.close()
    return status

def get_needed_reports(platform: str, last_date: datetime.date, current_date: datetime.date) -> Dict:
    """
    Determine which reports are needed for a platform based on last update
    """
    needed = {
        'financial': [],
        'operational': []
    }

    platform_config = PLATFORM_REPORTS.get(platform, {})

    # Check financial reports
    for report_name, report_config in platform_config.get('financial_reports', {}).items():
        freq = report_config.get('frequency', 'daily')
        days_behind = (current_date - last_date).days

        if freq == 'daily' and days_behind > 0:
            needed['financial'].append({
                'report': report_name,
                'priority': 'HIGH' if days_behind > 3 else 'MEDIUM',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_days': days_behind,
                'date_range': f"{last_date + timedelta(days=1)} to {current_date}"
            })
        elif freq == 'weekly' and days_behind > 7:
            needed['financial'].append({
                'report': report_name,
                'priority': 'MEDIUM',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_weeks': days_behind // 7
            })
        elif freq == 'monthly' and days_behind > 30:
            needed['financial'].append({
                'report': report_name,
                'priority': 'LOW',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_months': days_behind // 30
            })

    # Check operational reports
    for report_name, report_config in platform_config.get('operational_reports', {}).items():
        freq = report_config.get('frequency', 'daily')
        days_behind = (current_date - last_date).days

        if freq == 'daily' and days_behind > 0:
            needed['operational'].append({
                'report': report_name,
                'priority': 'MEDIUM',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_days': days_behind
            })
        elif freq == 'weekly' and days_behind > 7:
            needed['operational'].append({
                'report': report_name,
                'priority': 'LOW',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_weeks': days_behind // 7
            })
        elif freq == 'monthly' and days_behind > 30:
            needed['operational'].append({
                'report': report_name,
                'priority': 'LOW',
                'description': report_config.get('description'),
                'file_format': report_config.get('file_format'),
                'missing_months': days_behind // 30
            })

    return needed

def get_ai_summary() -> str:
    """
    Generate AI-friendly summary of missing data
    """
    status = get_data_status()
    summary_lines = [
        f"📅 DATA STATUS CHECK - {status['check_date']}",
        "=" * 80,
        ""
    ]

    for platform, data in status['platforms'].items():
        platform_name = platform.upper()
        summary_lines.append(f"\n{platform_name}:")
        summary_lines.append(f"  Last Updated: {data['last_updated']}")
        summary_lines.append(f"  Days Behind: {data['days_behind']}")
        summary_lines.append(f"  Status: {'✅ CURRENT' if data['status'] == 'current' else '⚠️ OUTDATED'}")

        reports = data.get('reports_needed', {})

        if reports.get('financial'):
            summary_lines.append(f"\n  📊 FINANCIAL REPORTS NEEDED:")
            for report in reports['financial']:
                summary_lines.append(f"    • {report['report']} - {report['priority']}")
                summary_lines.append(f"      {report['description']}")
                summary_lines.append(f"      Format: {report['file_format']}")
                if 'date_range' in report:
                    summary_lines.append(f"      Missing: {report['date_range']}")

        if reports.get('operational'):
            summary_lines.append(f"\n  ⚙️ OPERATIONAL REPORTS NEEDED:")
            for report in reports['operational']:
                summary_lines.append(f"    • {report['report']} - {report['priority']}")
                summary_lines.append(f"      {report['description']}")
                summary_lines.append(f"      Format: {report['file_format']}")

    return "\n".join(summary_lines)

if __name__ == '__main__':
    import json

    # Print status
    print(get_ai_summary())

    # Save JSON for API
    status = get_data_status()
    print("\n\n" + "=" * 80)
    print("JSON OUTPUT (for API):")
    print("=" * 80)
    print(json.dumps(status, indent=2))
