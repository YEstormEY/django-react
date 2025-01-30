from urllib import response
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Note

# Create your views here.
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
class NoteUpdate(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GetUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        partial = kwargs.get('partial', True)  # Allow partial updates

        # Check if 'old_password' and 'new_password' are in the request
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if old_password and new_password:
            if not user.check_password(old_password):
                # Return error if old password doesn't match
                return Response(
                    {"message": "Current password is incorrect"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set the new password if the old password matches
            user.set_password(new_password)
            user.save()
            return Response(
                {"message": "Password updated successfully!"}, 
                status=status.HTTP_200_OK
            )

        return Response(
            {"message": "Old and new passwords are required."}, 
            status=status.HTTP_400_BAD_REQUEST
        )




    

