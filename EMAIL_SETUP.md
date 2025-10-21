# Email Setup Guide for Nodemailer

## ✅ What's Been Set Up

- ✅ Nodemailer installed
- ✅ Server Action created (`src/app/actions/orderActions.ts`)
- ✅ OrderForm updated to send emails
- ✅ Loading states and error handling added
- ✅ Beautiful HTML email template

## 🔧 Configure Gmail (5 minutes)

### Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup wizard

### Step 2: Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other" → type "AA Toronto Bookstore"
4. Click "Generate"
5. **Copy the 16-character password** (you won't see it again!)

### Step 3: Update .env File

Edit `/Users/thom/Code/EIIRP/dev/aatoronto-bookstore/bookstore-app/.env`:

```bash
# Nodemailer SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com          # ← Change this
SMTP_PASS=xxxx xxxx xxxx xxxx                  # ← Paste app password here

# Email addresses
FROM_EMAIL=your-actual-email@gmail.com         # ← Change this
TO_EMAIL=bookstore@aatoronto.org               # ← Where orders go
```

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 🧪 Test It Out

1. Open http://localhost:3000
2. Fill out the order form
3. Add some book quantities
4. Click "Submit Order"
5. Review the modal
6. Click "Confirm Order"
6. Watch for success message!
7. Check your inbox (TO_EMAIL address)

## 📧 What the Email Looks Like

The email will have:
- ✅ Professional HTML formatting
- ✅ Customer information section
- ✅ Table of ordered books
- ✅ Total amount
- ✅ Timestamp
- ✅ Plain text fallback

## 🔒 Security Notes

- `.env` is in `.gitignore` ✅ (never commit it!)
- App passwords are safer than your main password
- Server Actions run on the server (credentials never exposed to browser)
- All email sending happens server-side

## 🚀 For Production (Vercel)

When you deploy to Vercel:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env`:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `TO_EMAIL`
3. Redeploy (automatic if connected to GitHub)

## 🐛 Troubleshooting

### "Invalid login" error
- Double-check SMTP_USER is correct
- Make sure you're using App Password, not regular password
- Verify 2FA is enabled

### "Connection refused"
- Check SMTP_PORT is 587
- Verify SMTP_HOST is smtp.gmail.com
- Try restarting dev server

### No email received
- Check spam folder
- Verify TO_EMAIL is correct
- Look at browser console for errors
- Check terminal for error logs

### "Username and Password not accepted"
- You need an App Password, not your regular Gmail password
- Generate one at: https://myaccount.google.com/apppasswords

## 📝 Alternative Email Providers

If you want to use a different email:

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=orders@yourdomain.com
SMTP_PASS=your-password
```

## ✨ Features Implemented

1. **Server Action** - Modern Next.js pattern
2. **Type-safe** - Full TypeScript support
3. **Error handling** - Graceful failures with user feedback
4. **Loading states** - Spinner while sending
5. **Success messages** - Clear feedback to users
6. **HTML emails** - Professional appearance
7. **Plain text fallback** - Works in all email clients
8. **Auto-refresh** - Form resets after success
9. **Validation** - Required fields checked
10. **Security** - Credentials never exposed to client

Enjoy your new order system! 🎉
