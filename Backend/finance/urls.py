from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpenseCategoryViewSet, ExpenseViewSet, GSTReportViewSet, HSNReportViewSet,
    CashFlowViewSet, BankAccountViewSet, BankTransactionViewSet
)

router = DefaultRouter()
router.register(r'expense-categories', ExpenseCategoryViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'gst-reports', GSTReportViewSet)
router.register(r'hsn-reports', HSNReportViewSet)
router.register(r'cash-flow', CashFlowViewSet)
router.register(r'bank-accounts', BankAccountViewSet)
router.register(r'bank-transactions', BankTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]