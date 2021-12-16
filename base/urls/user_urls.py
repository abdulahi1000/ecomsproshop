from django.urls import path
from base.views import user_views as views
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     # TokenRefreshView,
# )

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    
    path('profile/', views.getUserProfile, name='userprofile'),
    path('profile/update/', views.updateUserProfile, name='userprofile-update'),
    path('', views.getUsers, name='users'),

    path('<str:pk>/', views.getUserById, name='user-update'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]