"use client";

import { useState } from "react";
import { useCommon, Site } from "@/context/CommonContext";

export default function LiveViewPage({ params }: { params: any }) {
  const siteId = Number(params.siteId);
  const { sites } = useCommon();
  
  const site = sites?.find((site: Site) => +site.id === siteId);

  return (
      <div className="h-[75vh] flex flex-col">
        
        <div className="flex-grow bg-white rounded-lg shadow-md">
          {site?.liveView ? (
            <iframe
              src={`http://${site?.liveView}`}
              className="w-full h-full border-0"
              title={`Live view for ${site?.name}`}
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
              height="100%"
              width="100%"
              style={{ border: "none" }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Live stream URL not available</p>
            </div>
          )}
        </div>
      </div>
  );
}
