# 🚀 NestJS Tech Test - Email Parser & JSON Mapper

A NestJS application that demonstrates advanced email parsing capabilities and JSON transformation using DTOs and mapping libraries.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Swagger](#swagger)
- [Technologies Used](#technologies-used)
- [Author](#author)

## 🎯 Overview

This project implements two main challenges:

1. **JSON Mapping Service**: Transforms AWS SES event JSON to a custom output structure
2. **Email Parser Service**: Extracts JSON data from emails in multiple scenarios (attachments, direct links, or nested links)

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/ArgenisGonzalez/tech-test-nest.git
cd tech-test-nest
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional):

```bash
# .env
PORT=8888
URLS_API_ROOT=/api
```

## 🚀 Running the Application

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

### Debug mode

```bash
npm run start:debug
```

The application will be available at `http://localhost:8888`

## 📚 API Documentation

### Base URL

```
http://localhost:8888/api/v1
```

### Endpoints

#### 1. JSON Mapping Endpoint

**POST** `/mapping`

Transforms an AWS SES event JSON to a simplified output structure.

**Request Body:**

```json
{
  "Records": [
    {
      "eventVersion": "1.0",
      "ses": {
        "receipt": {
          "timestamp": "2015-09-11T20:32:33.936Z",
          "processingTimeMillis": 222,
          "recipients": ["recipient@example.com"],
          "spamVerdict": { "status": "PASS" },
          "virusVerdict": { "status": "PASS" },
          "spfVerdict": { "status": "PASS" },
          "dkimVerdict": { "status": "PASS" },
          "dmarcVerdict": { "status": "PASS" },
          "dmarcPolicy": "reject",
          "action": {
            "type": "SNS",
            "topicArn": "arn:aws:sns:us-east-1:012345678912:example-topic"
          }
        },
        "mail": {
          "timestamp": "2015-09-11T20:32:33.936Z",
          "source": "sender@example.com",
          "messageId": "d6iitobk75ur44p8kdnnp7g2n800",
          "destination": ["recipient@example.com"],
          "headersTruncated": false,
          "headers": [...],
          "commonHeaders": {
            "returnPath": "...",
            "from": ["sender@example.com"],
            "date": "Fri, 11 Sep 2015 20:32:32 +0000",
            "to": ["recipient@example.com"],
            "cc": ["cc@example.com"],
            "messageId": "<...>",
            "subject": "Example subject"
          }
        }
      },
      "eventSource": "aws:ses"
    }
  ]
}
```

**Response:**

```json
{
  "spam": true,
  "virus": true,
  "dns": true,
  "mes": "septiembre",
  "retrasado": false,
  "emisor": "sender",
  "receptor": ["recipient"]
}
```

**Response Fields:**

- `spam`: Boolean - `true` if spamVerdict.status is "PASS"
- `virus`: Boolean - `true` if virusVerdict.status is "PASS"
- `dns`: Boolean - `true` if all DNS checks (SPF, DKIM, DMARC) are "PASS"
- `mes`: String - Month name in Spanish from the timestamp
- `retrasado`: Boolean - `true` if processingTimeMillis > 1000ms
- `emisor`: String - Sender's email username (without domain)
- `receptor`: Array - Recipients' email usernames (without domain)

#### 2. Email Parser Endpoint

**GET** `/email/parse`

Parses an email file and extracts JSON content from various sources.

**Query Parameters:**

- `source` (required): URL or file path to the email file

**Examples:**

1. Parse email from local file:

```bash
GET /api/v1/email/parse?source=path-to-file.eml
```

At the root of this project are three test files; feel free to use them.

2. Parse email from URL:

```bash
GET /api/v1/email/parse?source=https://example.com/email.eml
```

Example url created for test

```bash
GET /api/v1/email/parse?source=https://gist.github.com/ArgenisGonzalez/a668b2116142b32aaa7243dbbb6c6885/raw/d9303da4cfdf34526bf6c511509076546084fe16/test-con-link-a-un-json.eml
```

**Supported JSON extraction methods:**

1. **Direct attachment**: JSON file attached to the email
2. **Direct link**: Link to `.json` file in email body
3. **Nested link**: Link to a webpage containing a link to the JSON file

**Response:**
Returns the extracted JSON content from the email.

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Error parsing email: No JSON found in attachments or links",
  "error": "Bad Request"
}
```

## 🧪 Testing

- For this repository, only unit tests for the mapping and email service were added.

### Run unit tests

```bash
npm run test
```

### Test Files Included

The project includes three test email files demonstrating different JSON extraction scenarios. This can be use for manually testing:

1. **test-with-attachment.eml**: Email with JSON file attached
2. **test-con-link-a-un-json.eml**: Email with direct link to JSON
3. **test-email-con-link-que-tiene-link-a-un-json2.eml**: Email with link to webpage containing JSON link

## 🛠️ Swagger

This project includes Swagger UI for easy exploration and testing of all endpoints.

Once the application is running, open your browser and go to:

```
http://localhost:8888/swagger
```

## 🛠️ Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **class-transformer** - Object transformation library
- **class-validator** - Validation using decorators
- **mailparser** - Email parsing library
- **axios** - HTTP client
- **cheerio** - Server-side DOM manipulation
- **Jest** - Testing framework

## 🔧 Configuration

### Environment Variables

| Variable        | Default      | Description      |
| --------------- | ------------ | ---------------- |
| `PORT`          | `8888`       | Application port |
| `URLS_API_ROOT` | `/api`       | API route prefix |
| `APP_NAME`      | `/APP`       | APP Name         |
| `URLS_PROTOCOL` | `http`       | APP Protocol     |
| `URLS_URL`      | `/localhost` | APP current url  |

### Global Settings

- **Validation**: Global validation pipe with whitelist and transform enabled
- **CORS**: Enabled for all origins
- **API Versioning**: Default version 1

## 👤 Author

**Argenis González**

## 📄 License

This project is part of a technical test for Designli.
