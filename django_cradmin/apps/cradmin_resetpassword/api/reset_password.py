from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class ResetPasswordApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, *args, **kwargs):
        old_password = self.request.data.get('old_password')
        new_password = self.request.data.get('new_password')
        user = self.request.user
        if not user.check_password(old_password):
            raise ValidationError({'old_password': 'Invalid password'})
        if not new_password:
            raise ValidationError({'new_password': 'Valid password must be provided'})
        user.set_password(new_password)
        user.save()
        return Response({'message': 'New password set'})
