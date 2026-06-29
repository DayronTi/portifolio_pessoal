from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import responder_com_groq


@api_view(["POST"])
def chat(request):
    mensagem = request.data.get("message", "").lower()

    if not mensagem:
        return Response({
            "resposta": "Me manda uma pergunta para eu te responder sobre o Bruno."
        })

    try:
        resposta = responder_com_groq(mensagem)

        return Response({
            "resposta": resposta
        })
    
    except Exception as erro:
        print(f"Erro no Groq: {erro}")

        return Response({
            "resposta": "Tive um problema ao responder essa pergunta. Tente novamente em alguns segundos."
        }, status=500)
