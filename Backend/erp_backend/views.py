from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import status

class UserDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        User = get_user_model()
        try:
            user = User.objects.get(pk=pk)
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            })
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)