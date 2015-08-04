from django.contrib import messages


class MessagesDebugMiddleware(object):
    """
    Add this to your MIDDLEWARE_CLASSES setting to debug Django messages
    rendering/styling. Will add one of each message type to the request.
    """
    def process_request(self, request):
        messages.debug(request, 'A debug message.')
        messages.info(request, 'An info message.')
        messages.success(request, 'A success  message.')
        messages.warning(request, 'A warning message.')
        messages.error(request, 'An error message.')
