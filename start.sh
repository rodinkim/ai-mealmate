#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

get_local_ip() {
    python -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(('8.8.8.8', 80))
print(s.getsockname()[0])
s.close()
" 2>/dev/null || echo "IP 확인 불가"
}

activate_venv() {
    if [ -f "$SCRIPT_DIR/backend/venv/Scripts/activate" ]; then
        source "$SCRIPT_DIR/backend/venv/Scripts/activate"
    elif [ -f "$SCRIPT_DIR/backend/venv/bin/activate" ]; then
        source "$SCRIPT_DIR/backend/venv/bin/activate"
    else
        echo "[ERROR] venv를 찾을 수 없습니다."
        echo "  cd backend && python -m venv venv && pip install -r requirements.txt"
        exit 1
    fi
}

case "$1" in
    b|backend)
        LOCAL_IP=$(get_local_ip)
        echo ""
        echo "  [Backend] FastAPI 시작"
        echo "  ├ 로컬:  http://localhost:8080"
        echo "  └ 모바일: http://$LOCAL_IP:8080"
        echo ""
        cd "$SCRIPT_DIR/backend"
        activate_venv
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
        ;;
    f|frontend)
        LOCAL_IP=$(get_local_ip)
        echo ""
        echo "  [Frontend] 서비스 시작"
        echo "  ├ 로컬:  http://localhost"
        echo "  └ 모바일: http://$LOCAL_IP"
        echo ""
        echo "  * 폰과 PC가 같은 와이파이에 연결되어 있어야 합니다"
        echo ""
        cd "$SCRIPT_DIR/frontend"
        python -m http.server 80 --bind 0.0.0.0
        ;;
    *)
        echo ""
        echo "  Usage: ./start.sh [b|f]"
        echo ""
        echo "  b, backend   FastAPI 백엔드 실행 (port 8080)"
        echo "  f, frontend  프론트엔드 실행    (port 80)"
        echo ""
        exit 1
        ;;
esac
