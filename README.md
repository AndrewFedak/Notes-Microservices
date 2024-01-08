# Notes-Microservices

## Purpose
This repo is proof of concept of Full-Stack application

## Tools
- front (React)
- back (NodeJS)
- db (Mongodb)
- messaging (RabbitMQ)
- JWT

## Network
- HTTP
- WebSocket

## Microservices
- Notes (responsible for CRUD of Notes)
- Users (responsible for authentication of users)

## Achievements
- Managed to provide real-time updates of Note that several Users may be viewing in a same time<br/>
  That was achieved by usage of WebSocket with RabbitMQ:
  - User views Note
  - Browser sends to Server through WebSocket connection message to view (subscribe on updates of) Note
  - Server remembers User WebSocket to publish message about "Note been updated"
  > Under hood, Server polls from specific RabbitMQ queue where messages about "Note been updated" will be sent.
  > Than once on message, to User's WebSocket connection we publish note/view message to notify about updated Note  
