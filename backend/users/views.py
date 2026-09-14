from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RegisterSerializer


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:

            return Response(
                {
                    "error": "Email and password are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            user = User.objects.get(email=email)

        except User.DoesNotExist:

            return Response(
                {
                    "error": "Invalid email or password"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = authenticate(
            username=user.username,
            password=password,
        )

        if user is not None:

            return Response(
                {
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "error": "Invalid email or password"
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )