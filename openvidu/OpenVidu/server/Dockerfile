# 베이스 이미지
FROM docker.io/openvidu/openvidu-server:3.3.0

# 설정 파일 & 스크립트 복사 (컨텍스트가 ./OpenVidu 이므로 상대경로)
COPY livekit.yaml /etc/livekit.yaml
COPY scripts/entrypoint_openvidu.sh /scripts/entrypoint.sh

# 실행권한 추가
RUN chmod +x /scripts/entrypoint.sh

# 실행
ENTRYPOINT ["/bin/sh", "/scripts/entrypoint.sh"]
CMD ["--config", "/etc/livekit.yaml"]

# 노출 포트
EXPOSE 3478/udp 7881/tcp 7900-7999/udp