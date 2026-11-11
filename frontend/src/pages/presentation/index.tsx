import React from 'react';
import Head from 'next/head';
import { PresentationDeck } from '../../components/presentation/PresentationDeck';

export default function PresentationPage() {
  return (
    <>
      <Head>
        <title>Project Presentation &amp; Defense 2026 | ShopEase</title>
        <meta
          name="description"
          content="Interactive Presentation Slides for ShopEase - Python Flask E-Commerce, Bakong KHQR, and Telegram Bot Automation."
        />
      </Head>
      <PresentationDeck />
    </>
  );
}

