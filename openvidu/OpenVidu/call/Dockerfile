# 베이스 이미지
FROM docker.io/openvidu/openvidu-call:3.3.0-demo

# 실행 스크립트 & 유틸 복사
COPY scripts/entrypoint_default_app.sh /scripts/entrypoint.sh
COPY scripts/utils.sh /scripts/utils.sh

# 실행권한 추가
RUN chmod +x /scripts/entrypoint.sh /scripts/utils.sh

# 실행
ENTRYPOINT ["/bin/sh", "/scripts/entrypoint.sh"]