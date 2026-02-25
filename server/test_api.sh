#!/bin/bash
TOKEN=$(curl -sS -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"ahmedtayebi"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
curl -v -X PUT http://localhost:5000/api/modules/mod-y1-s1-001 -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"title":"تشريح الجهاز العضلي"}'
