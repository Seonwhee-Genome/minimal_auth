from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User
from .serializers import SignupSerializer, UserSerializer
from .auth_utils import create_token, decode_token

@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = create_token(user)
        return Response({'token': token})  

    errors = serializer.errors
    
    # handling duplicate username
    if 'username' in errors:
        return Response({'error': errors['username'][0]}, status=400)
    elif 'password' in errors:
        password_errors = {
            'password_no_uppercase': 'Password must include uppercase letter',
            'password_no_lowercase': 'Password must include lowercase letter',
            'password_no_number': 'Password must include number',
            'password_no_special': 'Password must include special character',
        }
        
        error_msg = ""
        # append all types of password error
        for i in range(len(errors['password'])):
            error_msg += " "
            error_msg += password_errors.get(errors['password'][i], errors['password'][i])
        
        return Response({'error': error_msg}, status=400)      

    return Response({'error': 'invalid_request'}, status=400)


@api_view(['POST'])
def signin(request):
    user = authenticate(username=request.data['username'], password=request.data['password'])
    if user:
        token = create_token(user)
        return Response({'token': token})
    return Response({'error': 'Invalid credentials'}, status=401)


@api_view(['GET'])
def me(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'No token'}, status=401)
    
    if token and token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = decode_token(token)
        user = User.objects.get(id=payload['id'])
        return Response(UserSerializer(user).data)
    except:
        return Response({'error': 'Invalid token'}, status=401)


@api_view(['POST'])
def signout(request):
    return Response({'message': 'Logged out'})
