#!/usr/bin/env python
"""
Test dashboard stats endpoint
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'slms_core.settings')
django.setup()

from apps.dashboard.views import DashboardStatsView
from django.test import RequestFactory

try:
    rf = RequestFactory()
    request = rf.get('/api/dashboard/stats/')
    view = DashboardStatsView()
    response = view.get(request)
    print("✅ Dashboard stats endpoint works!")
    print(f"Status: {response.status_code}")
    print(f"Data keys: {list(response.data.keys())}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
