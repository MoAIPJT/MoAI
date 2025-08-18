# Dockerfile.ingress
FROM docker.io/openvidu/ingress:3.3.0

# 호스트의 ingress.yaml을 이미지 안으로 복사
COPY ingress.yaml /etc/ingress.yaml

ENV INGRESS_CONFIG_FILE=/etc/ingress.yaml
EXPOSE 1935 8085 7895/udp