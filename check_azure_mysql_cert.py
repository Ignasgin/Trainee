import ssl
import socket

hostname = "sql7802231.mysql.database.azure.com"
port = 3306

print(f"Checking SSL certificate for {hostname}:{port}\n")

try:
    # Create socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(10)
    sock.connect((hostname, port))
    
    # Wrap with SSL
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    with context.wrap_socket(sock, server_hostname=hostname) as ssock:
        cert = ssock.getpeercert()
        
        print("Certificate info:")
        print(f"Subject: {cert.get('subject')}")
        print(f"Issuer: {cert.get('issuer')}")
        print(f"Version: {cert.get('version')}")
        print(f"Serial: {cert.get('serialNumber')}")
        print(f"Not Before: {cert.get('notBefore')}")
        print(f"Not After: {cert.get('notAfter')}")
        
except Exception as e:
    print(f"Error: {e}")
