import React from 'react';
import WhyBuildHabits from '../Components/WhyBuildHabits';
import HeroBanner from '../Components/HeroBanner';
import HowItWorks from '../Components/HowItWorks';
import CommunitySection from '../Components/Community';

const Home = () => {
    return (
        <div>
           <HeroBanner></HeroBanner>
           <WhyBuildHabits></WhyBuildHabits>
           <HowItWorks></HowItWorks>
           <CommunitySection></CommunitySection>
        </div>
    );
};

export default Home;