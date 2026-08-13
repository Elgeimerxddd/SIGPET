import socket
import qrcode

def obtener_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # No se conecta realmente.
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "127.0.0.1"
    finally:
        s.close()

    return ip


ip = obtener_ip()

url = f"http://{ip}:5000"

qr = qrcode.make(url)

qr.save("static/qr_sigpet.png")

print("--------------------------------")
print("QR generado correctamente")
print("Dirección:", url)
print("--------------------------------")