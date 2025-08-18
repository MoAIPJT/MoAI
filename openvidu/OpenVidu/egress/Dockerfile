# Dockerfile.egress
FROM docker.io/livekit/egress:v1.9.1

# 호스트의 egress.yaml을 이미지 안으로 복사
COPY egress.yaml /etc/egress.yaml

ENV EGRESS_CONFIG_FILE=/etc/egress.yaml
VOLUME /home/egress/tmp