import React, { useEffect, useRef, useState } from 'react';
import { CountUp } from 'countup.js';
import axiosInstance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';

interface pyramidProps {
    board_id?: string;
}

export const getSeverityStats = async (board_id?:string) => {
    const params: any = {};
    if (board_id) params.board_id = board_id;

    const { data } = await axiosInstance.get('/dashboard/severity',{params});
    return data;
};

const Pyramid = ({ board_id }:pyramidProps) => {
    const [data, setData] = useState({
        catastrophic: 0,
        critical: 0,
        moderate: 0,
        minor: 0,
        hazardous: 0
    });
    

    const { data:newData, isLoading } = useQuery({
        queryKey: ['severityStats',board_id],
        queryFn: () => getSeverityStats(board_id),
    });

    useEffect(() => {
        if (newData?.data) {
            setData({
                catastrophic: newData.data?.CATASTROPHIC || 0,
                critical: newData.data?.CRITICAL || 0,
                moderate: newData.data?.MODERATE || 0,
                minor: newData.data?.MINOR || 0,
                hazardous: newData.data?.HAZARDOUS || 0
            });
        }
    }, [newData]);

    const criticalRef = useRef<SVGTextElement>(null);
    const catastrophicRef = useRef<SVGTextElement>(null);
    const moderateRef = useRef<SVGTextElement>(null);
    const minorRef = useRef<SVGTextElement>(null);
    const hazardousRef = useRef<SVGTextElement>(null);

    useEffect(() => {
        if (criticalRef.current) {
        const countUp = new CountUp(criticalRef.current as unknown as HTMLElement, data?.critical || 0, {
            duration: 2
        });
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
        }
    }, [data?.critical]);

    useEffect(() => {
        if (catastrophicRef.current) {
        const countUp = new CountUp(catastrophicRef.current as unknown as HTMLElement, data?.catastrophic || 0, {
            duration: 2
        });
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
        }
    }, [data?.catastrophic]);

    useEffect(() => {
        if (moderateRef.current) {
        const countUp = new CountUp(moderateRef.current as unknown as HTMLElement, data?.moderate || 0, {
            duration: 2
        });
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
        }
    }, [data?.moderate]);

    useEffect(() => {
        if (minorRef.current) {
        const countUp = new CountUp(minorRef.current as unknown as HTMLElement, data?.minor || 0, {
            duration: 2
        });
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
        }
    }, [data?.minor]);

    useEffect(() => {
        if (hazardousRef.current) {
        const countUp = new CountUp(hazardousRef.current as unknown as HTMLElement, data?.hazardous || 0, {
            duration: 2
        });
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
        }
    }, [data?.hazardous]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    
    return (
        <div className="text-center" style={{ maxWidth: '100%', height: 'auto' }}>
            <svg 
                style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxWidth: '479px',
                    display: 'inline-block'
                }} 
                viewBox="0 0 479 308" 
                preserveAspectRatio="xMidYMid meet"
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Artboard</title>
                <defs>
                                    <linearGradient x1="155.281464%" y1="45.4527845%" x2="-2.52101535%" y2="51.7302836%" id="linearGradient-1">
                                        <stop stop-color="#CFDDE1" offset="0%"></stop>
                                        <stop stop-color="#FFFFFF" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="42.9002488%" y1="147.005721%" x2="54.5330846%" y2="-10.5656716%" id="linearGradient-2">
                                        <stop stop-color="#FFFFFF" offset="0%"></stop>
                                        <stop stop-color="#FDFDFD" offset="39.05%"></stop>
                                        <stop stop-color="#F4F7F8" offset="62.1%"></stop>
                                        <stop stop-color="#E6EDEF" offset="80.93%"></stop>
                                        <stop stop-color="#D2DFE3" offset="97.48%"></stop>
                                        <stop stop-color="#CFDDE1" offset="99.55%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="-0.694315831%" y1="-15.9505263%" x2="66.0789289%" y2="110.737216%" id="linearGradient-3">
                                        <stop stop-color="#FF155D" offset="1.4e-05%"></stop>
                                        <stop stop-color="#F81355" offset="17.99%"></stop>
                                        <stop stop-color="#E30E40" offset="45.45%"></stop>
                                        <stop stop-color="#C3061E" offset="78.77%"></stop>
                                        <stop stop-color="#AA0004" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="-0.665114498%" y1="49.9818824%" x2="100.763833%" y2="49.9818824%" id="linearGradient-4">
                                        <stop stop-color="#FF155D" offset="1.4e-05%"></stop>
                                        <stop stop-color="#F81355" offset="17.99%"></stop>
                                        <stop stop-color="#E30E40" offset="45.45%"></stop>
                                        <stop stop-color="#C3061E" offset="78.77%"></stop>
                                        <stop stop-color="#AA0004" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="131.311455%" y1="44.609458%" x2="13.6255441%" y2="51.8889932%" id="linearGradient-5">
                                        <stop stop-color="#CFDDE1" offset="0%"></stop>
                                        <stop stop-color="#FFFFFF" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="18.7229522%" y1="29.7686101%" x2="63.3906543%" y2="65.9391624%" id="linearGradient-6">
                                        <stop stop-color="#FF8F3F" offset="1.4e-05%"></stop>
                                        <stop stop-color="#FA873A" offset="17.85%"></stop>
                                        <stop stop-color="#EA722B" offset="45.09%"></stop>
                                        <stop stop-color="#D25013" offset="78.16%"></stop>
                                        <stop stop-color="#BF3500" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="42.8994652%" y1="146.898396%" x2="54.5347594%" y2="-10.7058824%" id="linearGradient-7">
                                        <stop stop-color="#FFFFFF" offset="0%"></stop>
                                        <stop stop-color="#FDFDFD" offset="39.05%"></stop>
                                        <stop stop-color="#F4F7F8" offset="62.1%"></stop>
                                        <stop stop-color="#E6EDEF" offset="80.93%"></stop>
                                        <stop stop-color="#D2DFE3" offset="97.48%"></stop>
                                        <stop stop-color="#CFDDE1" offset="99.55%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="136.631324%" y1="44.3822584%" x2="19.0178028%" y2="51.5384492%" id="linearGradient-8">
                                        <stop stop-color="#CFDDE1" offset="0%"></stop>
                                        <stop stop-color="#FFFFFF" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="23.1295326%" y1="37.6015132%" x2="62.5968916%" y2="59.2219795%" id="linearGradient-9">
                                        <stop stop-color="#FFB32C" offset="1.4e-05%"></stop>
                                        <stop stop-color="#FFAC27" offset="23.5%"></stop>
                                        <stop stop-color="#FF9717" offset="59.37%"></stop>
                                        <stop stop-color="#FF7700" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="42.8280749%" y1="147.090909%" x2="54.463369%" y2="-10.513369%" id="linearGradient-10">
                                        <stop stop-color="#FFFFFF" offset="0%"></stop>
                                        <stop stop-color="#FDFDFD" offset="39.05%"></stop>
                                        <stop stop-color="#F4F7F8" offset="62.1%"></stop>
                                        <stop stop-color="#E6EDEF" offset="80.93%"></stop>
                                        <stop stop-color="#D2DFE3" offset="97.48%"></stop>
                                        <stop stop-color="#CFDDE1" offset="99.55%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="141.776758%" y1="44.88924%" x2="24.6460937%" y2="51.0660498%" id="linearGradient-11">
                                        <stop stop-color="#CFDDE1" offset="0%"></stop>
                                        <stop stop-color="#FFFFFF" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="25.4212352%" y1="41.1251241%" x2="62.2211528%" y2="56.3727477%" id="linearGradient-12">
                                        <stop stop-color="#F6FF00" offset="1.4e-05%"></stop>
                                        <stop stop-color="#EEF900" offset="23.99%"></stop>
                                        <stop stop-color="#D9EA00" offset="60.59%"></stop>
                                        <stop stop-color="#BBD400" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="42.7262032%" y1="146.882086%" x2="54.3614973%" y2="-10.7216578%" id="linearGradient-13">
                                        <stop stop-color="#FFFFFF" offset="0%"></stop>
                                        <stop stop-color="#FDFDFD" offset="39.05%"></stop>
                                        <stop stop-color="#F4F7F8" offset="62.1%"></stop>
                                        <stop stop-color="#E6EDEF" offset="80.93%"></stop>
                                        <stop stop-color="#D2DFE3" offset="97.48%"></stop>
                                        <stop stop-color="#CFDDE1" offset="99.55%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="146.951573%" y1="45.0986892%" x2="30.2047408%" y2="50.7322976%" id="linearGradient-14">
                                        <stop stop-color="#CFDDE1" offset="14.55%"></stop>
                                        <stop stop-color="#FFFFFF" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="26.682613%" y1="43.0656643%" x2="61.9274605%" y2="54.8718281%" id="linearGradient-15">
                                        <stop stop-color="#00E984" offset="1.4e-05%"></stop>
                                        <stop stop-color="#05E37C" offset="13.66%"></stop>
                                        <stop stop-color="#12D267" offset="34.5%"></stop>
                                        <stop stop-color="#27B644" offset="59.94%"></stop>
                                        <stop stop-color="#439015" offset="88.74%"></stop>
                                        <stop stop-color="#507F00" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient x1="42.7574866%" y1="146.963102%" x2="54.3925134%" y2="-10.6411765%" id="linearGradient-16">
                                        <stop stop-color="#FFFFFF" offset="0%"></stop>
                                        <stop stop-color="#FDFDFD" offset="39.05%"></stop>
                                        <stop stop-color="#F4F7F8" offset="62.1%"></stop>
                                        <stop stop-color="#E6EDEF" offset="80.93%"></stop>
                                        <stop stop-color="#D2DFE3" offset="97.48%"></stop>
                                        <stop stop-color="#CFDDE1" offset="99.55%"></stop>
                                    </linearGradient>
                                </defs>
                <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="infographics" transform="translate(27.2827, 26.5997)" fill-rule="nonzero">
                    <g id="Group">
                                            <g transform="translate(119.1688, 0)">
                                                <path d="M168.148551,58.1003472 L31.7485505,58.1003472 L31.7485505,0.000347204758 L168.148551,0.000347204758 C189.048551,0.000347204758 201.148551,13.5003472 201.148551,27.9003472 L201.148551,28.8003472 C201.148551,47.1003472 186.348551,58.1003472 168.148551,58.1003472 Z" id="Path" fill="url(#linearGradient-1)"></path>
                                                <circle id="Oval" fill="url(#linearGradient-2)" cx="168.448551" cy="28.2003472" r="20.1"></circle>
                                                <path d="M62.6485505,46.4003472 L38.7485505,4.0003472 C35.7485505,-1.3996528 27.9485505,-1.2996528 24.9485505,4.1003472 C19.5485505,14.0003472 11.2485505,28.7003472 1.04855052,46.3003472 C-1.95144948,51.5003472 1.84855052,58.1003472 7.84855052,58.1003472 L55.7485505,58.1003472 C61.8485505,58.1003472 65.6485505,51.6003472 62.6485505,46.4003472 Z" id="Path" stroke="url(#linearGradient-4)" fill="url(#linearGradient-3)"></path>
                                                <circle id="Oval" fill="#EBF0F3" transform="translate(168.4073, 28.12) rotate(-22.2227) translate(-168.4073, -28.12)" cx="168.407348" cy="28.1200097" r="16.4996348"></circle>
                                            </g>
                                            <g transform="translate(89.8137, 61.1003)">
                                                <path d="M236.703634,47.4 L85.4036338,47.4 L85.4036338,1.13686838e-13 L236.703634,1.13686838e-13 C249.603634,1.13686838e-13 260.003634,10.4 260.003634,23.3 L260.003634,24.1 C260.003634,37 249.603634,47.4 236.703634,47.4 Z" id="Path" fill="url(#linearGradient-5)"></path>
                                                <path d="M19.6036338,3.9 C13.7036338,14 7.50363377,24.6 1.10363377,35.5 C-1.99636623,40.7 1.80363377,47.3 7.90363377,47.3 L113.603634,47.3 C119.603634,47.3 123.403634,40.8 120.503634,35.6 L102.703634,4 C101.303634,1.5 98.7036338,0 95.8036338,0 L26.5036338,0 C23.6036338,0 21.0036338,1.5 19.6036338,3.9 Z" id="Path" fill="url(#linearGradient-6)"></path>
                                                <g id="Oval" transform="translate(211.4036, 4.2)">
                                                    <circle fill="url(#linearGradient-7)" cx="18.7" cy="18.7" r="18.7"></circle>
                                                    <circle fill="#EBF0F3" cx="18.7" cy="18.7" r="15.3"></circle>
                                                </g>
                                            </g>
                                            <g transform="translate(60.1137, 111.5003)">
                                                <path d="M296.903634,47.4 L142.703634,47.4 L142.703634,0 L296.903634,0 C309.803634,0 320.203634,10.4 320.203634,23.3 L320.203634,24.1 C320.203634,37 309.803634,47.4 296.903634,47.4 Z" id="Path" fill="url(#linearGradient-8)"></path>
                                                <path d="M19.8036338,3.9 C13.6036338,14.4 7.30363377,25.1 1.10363377,35.5 C-1.99636623,40.7 1.80363377,47.4 7.90363377,47.4 L171.703634,47.4 C177.703634,47.4 181.503634,40.9 178.603634,35.7 L160.803634,4.1 C159.403634,1.6 156.803634,0.1 153.903634,0.1 L26.6036338,0.1 C23.8036338,0.1 21.2036338,1.5 19.8036338,3.9 Z" id="Path" fill="url(#linearGradient-9)"></path>
                                                <g id="Oval" transform="translate(271.6036, 5)">
                                                    <circle fill="url(#linearGradient-10)" cx="18.7" cy="18.7" r="18.7"></circle>
                                                    <circle fill="#EBF0F3" cx="18.7" cy="18.7" r="15.3"></circle>
                                                </g>
                                            </g>
                                            <g transform="translate(30.1137, 162.0003)">
                                                <path d="M357.303634,47.4 L175.803634,47.4 L175.803634,0 L357.303634,0 C370.203634,0 380.603634,10.4 380.603634,23.3 L380.603634,24.1 C380.503634,36.9 370.103634,47.4 357.303634,47.4 Z" id="Path" fill="url(#linearGradient-11)"></path>
                                                <path d="M236.903634,35.6 L219.103634,4 C217.703634,1.5 215.103634,0 212.203634,0 L26.7036338,0 C23.9036338,0 21.4036338,1.5 19.9036338,3.9 C13.3036338,15 7.00363377,25.6 1.10363377,35.5 C-1.99636623,40.7 1.80363377,47.4 7.90363377,47.4 L230.003634,47.4 C236.103634,47.4 239.903634,40.9 236.903634,35.6 Z" id="Path" fill="url(#linearGradient-12)"></path>
                                                <g id="Oval" transform="translate(330.7296, 3.6486)">
                                                    <circle fill="url(#linearGradient-13)" cx="19.9740803" cy="20.051428" r="18.7"></circle>
                                                    <circle fill="#EBF0F3" transform="translate(20.0231, 20.0231) rotate(-22.7239) translate(-20.0231, -20.0231)" cx="20.0231134" cy="20.0231134" r="15.3003783"></circle>
                                                </g>
                                            </g>
                                            <g transform="translate(0, 212.4003)">
                                                <path d="M411.017315,47.8 L208.817315,47.8 L208.817315,1.13686838e-13 L411.017315,1.13686838e-13 C424.017315,1.13686838e-13 434.517315,10.5 434.517315,23.5 L434.517315,24.3 C434.517315,37.3 423.917315,47.8 411.017315,47.8 Z" id="Path" fill="url(#linearGradient-14)"></path>
                                                <path d="M20.2173153,3.9 C12.3173153,17.2 5.71731535,28.2 1.11731535,35.9 C-1.98268465,41.1 1.71731535,47.8 7.91731535,47.8 L288.917315,47.8 C294.917315,47.8 298.717315,41.3 295.817315,36.1 L277.717315,4 C276.317315,1.5 273.717315,0 270.817315,0 L27.0173153,0 C24.2173153,0 21.6173153,1.5 20.2173153,3.9 Z" id="Path" fill="url(#linearGradient-15)"></path>
                                                <g id="Oval" transform="translate(382.9556, 2.2453)">
                                                    <circle fill="url(#linearGradient-16)" cx="21.6616966" cy="21.65462" r="18.7"></circle>
                                                    <circle fill="#EBF0F3" transform="translate(21.6373, 21.6373) rotate(-45) translate(-21.6373, -21.6373)" cx="21.63726" cy="21.63726" r="15.2998533"></circle>
                                                </g>
                                            </g>
                                        </g>
                        <g id={String(data?.hazardous)} transform="translate(382.8965, 229.4774)" fill="#3A9C24">
                            <text x="15" y="14" fontSize="14" fontWeight="bold" className="flex justify-center items-center" ref={hazardousRef} >{data?.hazardous}</text>
                        </g>
                        <g id={String(data?.critical)} transform="translate(282.6448, 20.9906)" fill="#D20000">
                            <text x="0" y="14" fontSize="14" fontWeight="bold" className="flex justify-center items-center" ref={catastrophicRef} >{data?.catastrophic}</text>
                        </g>
                        <g id={String(data?.moderate)} transform="translate(339.3477, 128.1664)" fill="#FF8409">
                            <text x="8" y="14" fontSize="14" fontWeight="bold" className="flex justify-center items-center" ref={moderateRef} >{data?.moderate}</text>
                        </g>
                        <g id={String(data?.minor)} transform="translate(387.6448, 178.9906)" fill="#9CAD00">
                            <text x="-10" y="14" fontSize="14" fontWeight="bold" className="flex justify-center items-center" ref={minorRef} >{data?.minor}</text>
                        </g>
                        <g id={String(data?.catastrophic)} transform="translate(309.6448, 76.9906)" fill="#B55300">
                            <text x="5" y="14" fontSize="14" fontWeight="bold" className="flex justify-center items-center" ref={criticalRef}>{data?.critical}</text>
                        </g>
                        <g id="Catastrophic" transform="translate(184.2632, 23.6503)" fill="#D20000">
                            <text id="Catastrophic" font-size="12" font-weight="bold" fill="#D20000" className="absolute top-1/2 left-1/2 transform translate-x-0 translate-y-[10px]">Catastrophic</text>
                        </g>
                        <g id="Critical" transform="translate(214.2632, 78.6503)" fill="#B55300">
                            <text id="Critical" font-size="12" font-weight="bold" fill="#B55300" className="absolute top-1/2 left-1/2 transform translate-x-0 translate-y-[10px]">Critical</text>
                        </g>
                        <g id="Moderate" transform="translate(243.5425, 126.6503)" fill="#FF8409">
                            <text id="Moderate" font-size="12" font-weight="bold" fill="#FF8409" className="absolute top-1/2 left-1/2 transform translate-x-0 translate-y-[10px]">Moderate</text>
                        </g>
                        <g id="Minor" transform="translate(276.5425, 181.809)" fill="#9CAD00">
                            <text id="Minor" font-size="12" font-weight="bold" fill="#9CAD00" className="absolute top-1/2 left-1/2 transform translate-x-0 translate-y-[10px]">Minor</text>
                        </g>
                        <g id="Hazardous,-Unsafe-&" transform="translate(307.7583, 219.4003)" fill="#3A9C24">
                            <text id="Minor" font-size="12" font-weight="bold" fill="#3A9C24" className="absolute top-1/2 left-1/2 transform translate-x-0 translate-y-[20px]">Hazardous</text>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default Pyramid;












// import React from "react";

// export default function PyramidChart() {
//   const data = [
//     { label: "Catastrophic", value: 0, bgColor: "bg-red-600", circleColor: "bg-gray-200", textColor: "text-white" },
//     { label: "Critical", value: 4, bgColor: "bg-orange-500", circleColor: "bg-gray-200", textColor: "text-white" },
//     { label: "Moderate", value: 14, bgColor: "bg-orange-300", circleColor: "bg-gray-200", textColor: "text-white" },
//     { label: "Minor", value: 120, bgColor: "bg-yellow-400", circleColor: "bg-gray-200", textColor: "text-black" },
//     { label: "Hazardous, Unsafe & Violations", value: 1683, bgColor: "bg-green-500", circleColor: "bg-gray-200", textColor: "text-white" },
//   ];

//   return (
//     <div className="flex flex-col items-center mt-10">
//       {data.map((item, index) => (
//         <div
//           key={index}
//           className={`relative flex items-center justify-between w-full max-w-md lg:max-w-2xl py-3 px-5 rounded-lg ${item.bgColor} ${item.textColor}`}
//           style={{
//             clipPath: index === 0 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
//             marginTop: index === 0 ? "0" : "-12px", // Overlapping layers
//           }}
//         >
//           {/* Left Label */}
//           <span className="font-semibold text-sm">{item.label}</span>

//           {/* Right Circular Value */}
//           <div
//             className={`absolute right-[-50px] lg:right-[-60px] flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full ${item.circleColor} shadow-md`}
//           >
//             <span className="text-lg font-bold text-gray-700">{item.value}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }