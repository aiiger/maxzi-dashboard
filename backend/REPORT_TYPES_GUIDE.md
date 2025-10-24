# MAXZI Analytics - Platform Report Types Guide

## Overview
This guide explains all report types needed from each delivery platform, organized by Financial vs Operational categories.

---

## 🏢 DELIVEROO

### 📊 Financial Reports (Revenue-Critical)

#### 1. Order History Report
- **File Name**: `order_history.csv` or `deliveroo_orders.csv`
- **Update Frequency**: Daily
- **Priority**: 🔴 HIGH
- **Where to Find**: Deliveroo Partner Portal → Reports → Order History
- **Required Columns**:
  - `date_submitted` - Order date
  - `order_number` - Unique order ID
  - `location_name` - Restaurant location
  - `subtotal` - Order value before commission
  - `commission` - Deliveroo commission amount
  - `vat_on_commission` - VAT on commission
  - `order_status` - Completed/Cancelled
- **Purpose**: Daily revenue tracking, commission calculations, location performance
- **Database Table**: `deliveroo_orders`

### ⚙️ Operational Reports (Performance Metrics)

#### 2. Delivery Performance Report
- **File Name**: `delivery_performance.csv`
- **Update Frequency**: Weekly
- **Priority**: 🟡 MEDIUM
- **Where to Find**: Deliveroo Partner Portal → Reports → Performance
- **Required Columns**:
  - `delivery_duration_minutes` - Time from order to delivery
  - `order_status` - Completed/Late/Cancelled
  - `date_delivered` - Delivery completion time
- **Purpose**: Track delivery speed, identify delays, operational KPIs
- **Database Table**: `deliveroo_orders` (same table, different metrics)

---

## 🍜 TALABAT

### 📊 Financial Reports (Revenue-Critical)

#### 1. Transaction History
- **File Name**: `transaction_history.csv` or API export
- **Update Frequency**: Daily
- **Priority**: 🔴 HIGH
- **Where to Find**: Talabat Partner Portal → Financial Reports → Transactions
- **Required Columns**:
  - `transaction_date` - Order date
  - `order_value` - Total order amount
  - `commission_amount` - Talabat commission
  - `commission_rate` - Commission percentage
  - `order_count` - Number of orders
  - `order_status` - Completed/Cancelled
- **Purpose**: Daily revenue tracking, commission analysis
- **Database Table**: `order_transactions` (platform='talabat')

### ⚙️ Operational Reports (Performance Metrics)

#### 2. Preparation Time Report
- **File Name**: `preparation_time.xlsx`
- **Update Frequency**: Monthly
- **Priority**: 🟢 LOW
- **Where to Find**: Talabat Partner Portal → Performance → Kitchen Metrics
- **Required Columns**:
  - `month` - Report month
  - `location_name` - Restaurant location
  - `avg_prep_time_minutes` - Average kitchen prep time
  - `avoidable_delay_count` - Number of avoidable delays
  - `avoidable_delay_rate` - Percentage of orders delayed
- **Purpose**: Kitchen efficiency monitoring, identify bottlenecks
- **Database Table**: `talabat_preparation_time`

#### 3. Order Rejections Report
- **File Name**: `order_rejections.xlsx`
- **Update Frequency**: Monthly
- **Priority**: 🟢 LOW
- **Where to Find**: Talabat Partner Portal → Performance → Rejections
- **Purpose**: Track rejected orders, identify issues
- **Database Table**: `talabat_order_rejections`

#### 4. Offline Duration Report
- **File Name**: `offline_duration.xlsx`
- **Update Frequency**: Monthly
- **Priority**: 🟢 LOW
- **Where to Find**: Talabat Partner Portal → Performance → Availability
- **Purpose**: Track when restaurants are marked offline
- **Database Table**: `talabat_offline_duration`

#### 5. Contact Rate Report
- **File Name**: `contact_rate.xlsx`
- **Update Frequency**: Monthly
- **Priority**: 🟢 LOW
- **Purpose**: Customer support contact frequency
- **Database Table**: `talabat_contact_rate`

---

## 🍔 SAPAAD (POS System)

### 📊 Financial Reports (Revenue-Critical)

#### 1. Location Sales Report
- **File Name**: `location_sales.csv` or database export
- **Update Frequency**: Daily
- **Priority**: 🔴 HIGH
- **Where to Find**: SAPAAD Dashboard → Reports → Sales by Location
- **Required Columns**:
  - `sale_date` - Transaction date
  - `location_name` - Restaurant location
  - `total_sales` - Total revenue for the day
  - `order_count` - Number of orders/checks
  - `avg_per_check` - Average order value
  - `payment_visa` - Visa card payments
  - `payment_mastercard` - Mastercard payments
  - `payment_cash` - Cash payments
  - `payment_qlub` - Qlub app payments
  - `payment_other` - Other payment methods
- **Purpose**: Dine-in revenue tracking, payment method analysis, location performance
- **Database Table**: `sapaad_location_sales`

### ⚙️ Operational Reports (Performance Metrics)

#### 2. Payment Methods Breakdown
- **File Name**: Included in `location_sales.csv`
- **Update Frequency**: Daily
- **Priority**: 🟡 MEDIUM
- **Where to Find**: Same as Location Sales Report
- **Required Columns**: payment_visa, payment_mastercard, payment_cash, payment_qlub, payment_other
- **Purpose**: Payment analytics, cash flow tracking, digital payment adoption
- **Database Table**: `sapaad_location_sales` (same table)

---

## 🌙 NOON FOOD

### 📊 Financial Reports (Revenue-Critical)

#### 1. Transaction Summary
- **File Name**: `noon_transactions.csv` or API export
- **Update Frequency**: Monthly
- **Priority**: 🟡 MEDIUM
- **Where to Find**: Noon Partner Portal → Reports → Monthly Summary
- **Required Columns**:
  - `transaction_date` - Order month
  - `order_value` - Total order amount
  - `order_count` - Number of orders
  - `commission_amount` - Noon commission
  - `order_status` - Completed/Cancelled
- **Purpose**: Monthly revenue tracking (lower volume platform)
- **Database Table**: `order_transactions` (platform='noon')

### ⚙️ Operational Reports (Performance Metrics)

#### 2. Order Status Report
- **File Name**: `order_status.csv`
- **Update Frequency**: Monthly
- **Priority**: 🟢 LOW
- **Where to Find**: Noon Partner Portal → Reports → Order Status
- **Purpose**: Order completion rates, cancellation tracking
- **Database Table**: `order_transactions` (platform='noon')

---

## 📋 Report Priority Matrix

### 🔴 HIGH PRIORITY (Upload within 24 hours)
1. Deliveroo Order History (Daily)
2. Talabat Transaction History (Daily)
3. SAPAAD Location Sales (Daily)

**Why**: These directly affect revenue calculations and financial analytics.

### 🟡 MEDIUM PRIORITY (Upload weekly)
1. Deliveroo Delivery Performance (Weekly)
2. SAPAAD Payment Methods (Daily, but less critical)
3. Noon Transaction Summary (Monthly)

**Why**: Important for operations but don't affect revenue calculations.

### 🟢 LOW PRIORITY (Upload monthly)
1. Talabat Preparation Time (Monthly)
2. Talabat Order Rejections (Monthly)
3. Talabat Offline Duration (Monthly)
4. Talabat Contact Rate (Monthly)
5. Noon Order Status (Monthly)

**Why**: Nice-to-have operational metrics for long-term analysis.

---

## 🤖 AI Chatbot Intelligence

The AI chatbot knows:
- ✅ Last update date for each report type
- ✅ Which reports are missing based on current date
- ✅ Priority level of each report
- ✅ Where to find each report on partner portals
- ✅ Expected file formats and columns
- ✅ How many days/weeks/months behind each report is

Ask the chatbot:
- "What reports am I missing?"
- "Which Deliveroo report do I need?"
- "Where can I find the Talabat transaction history?"
- "What's the priority for SAPAAD reports?"

---

## 📅 Update Schedule Cheat Sheet

| Platform | Report Type | Frequency | Best Day to Upload |
|----------|-------------|-----------|-------------------|
| Deliveroo | Financial | Daily | Every morning |
| Deliveroo | Operational | Weekly | Monday |
| Talabat | Financial | Daily | Every morning |
| Talabat | Operational | Monthly | 1st of month |
| SAPAAD | Financial | Daily | Every morning |
| SAPAAD | Operational | Daily | With financial |
| Noon | Financial | Monthly | 1st of month |
| Noon | Operational | Monthly | 1st of month |

---

## 🚨 Common Issues

### "I can't find the report on the platform"
- Check if you have the correct permissions on the partner portal
- Some reports require "Finance" or "Admin" access
- Contact platform support to request access

### "The file format is different"
- Platforms sometimes change column names
- Core data should still be there
- Contact support if columns are missing

### "Data doesn't match"
- Make sure you're downloading the correct date range
- Check for timezone differences
- Verify all locations are included in the export

### "Upload failed"
- Check file format (CSV vs Excel)
- Verify all required columns are present
- Check for special characters in location names
- Try re-downloading from platform

---

## 📞 Support Contacts

**Deliveroo Partner Support**: partners@deliveroo.com
**Talabat Partner Support**: partnersupport@talabat.com
**Noon Food Support**: partnersupport@noon.com
**SAPAAD Support**: support@sapaad.com

For urgent issues with missing data, contact the platform support and request:
1. Access to financial reports
2. Historical data export
3. API access (if available)
