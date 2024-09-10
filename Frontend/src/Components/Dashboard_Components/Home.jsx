import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { All_Data } from "../../App";
import { Business_clicked } from "../Dashboard";

const Home = () => {
  const {clickedItem, setClickedItem} = useContext(Business_clicked)
  return (
    <>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-20">
            <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              Welcome to
            </h2>
            <h1 class="sm:text-4xl text-2xl font-medium title-font mb-4 text-gray-900">
              Invest_In <br /><span className="text-xl text-gray-500">  Where Opportunities Meet Investments!</span>
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              At Invest_In, we are dedicated to transforming dreams into
              realities. Whether you are an ambitious entrepreneur seeking the
              perfect investor for your venture or a seasoned investor scouting
              for promising opportunities, our innovative web portal is your
              gateway to a world of possibilities.
            </p>
          </div>
          <div class="flex flex-wrap">
            <div class="xl:w-2/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Investors
              </h2>
              <p class="leading-relaxed text-base mb-4">
               
                Investors, welcome to a curated marketplace of innovation and growth. Our platform offers you a diverse array of investment opportunities, ranging from innovative startups to established small businesses with proven track records. Navigate through detailed profiles, comprehensive business plans, and engaging pitches to discover ventures aligning with your investment goals. With our intelligent matching algorithms, you can explore opportunities tailored to your preferences, risk appetite, and industry interests. Invest_In ensures that you are well-informed, confident, and connected when making investment decisions.
              </p>
              <a class="text-indigo-500 inline-flex items-center" onClick={()=>setClickedItem('Investor')}>
                Explore
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <div class="xl:w-2/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2" >
                Entrepreneurs
              </h2>
              <p class="leading-relaxed text-base mb-4">
                Are you an entrepreneur with a groundbreaking idea, a passionate vision, and the drive to make a difference? Look no further. Our user-friendly web portal is designed exclusively for you. Here, you can showcase your business concepts, pitch your ideas, and connect with a vast network of investors actively seeking ventures like yours. Our platform provides comprehensive tools to craft compelling pitches, access resources, and receive invaluable feedback from seasoned experts. We believe in empowering you to secure the funding you need to turn your aspirations into thriving businesses.
              </p>
              <a class="text-indigo-500 inline-flex items-center"onClick={()=>setClickedItem('Business')} >
                Explore
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          <section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Why Us?</h1>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Diverse Portfolio</h2>
          <p class="leading-relaxed text-base">Explore a wide spectrum of businesses from various industries, allowing you to diversify your investments intelligently.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Tansparency</h2>
          <p class="leading-relaxed text-base">We prioritize transparency at every step. Detailed business profiles, financial projections, and interactive discussions enable you to make well-informed decisions.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Expert guuidance</h2>
          <p class="leading-relaxed text-base">Access mentorship and guidance from industry experts and successful entrepreneurs. Learn from the best to enhance your investment strategies.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Community</h2>
          <p class="leading-relaxed text-base">Join a vibrant community of like-minded individuals. Engage in discussions, and collaborate to nurture the spirit of entrepreneurship and investment.</p>
        </div>
      </div>
    </div>
  </div>
</section>
        </div>
      </section>
    </>
  );
};

export default Home;
