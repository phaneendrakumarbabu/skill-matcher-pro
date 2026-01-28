#!/bin/bash

# ResumeAI Pro - Deployment Script
# This script helps deploy your app to Vercel

echo "🚀 ResumeAI Pro - Deployment Script"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the skill-matcher-pro-main directory"
    exit 1
fi

echo "🔍 Running pre-deployment checks..."
echo ""

# Test build
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for confirmation
echo "🤔 Ready to deploy to production?"
echo "   This will deploy your app to Vercel."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to production
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Add VITE_OPENAI_API_KEY in Vercel Dashboard"
    echo "   2. Add your Vercel domain to Firebase authorized domains"
    echo "   3. Test your app at the deployed URL"
    echo ""
    echo "📚 See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "   Check the error messages above"
    echo "   See DEPLOYMENT.md for troubleshooting"
fi
