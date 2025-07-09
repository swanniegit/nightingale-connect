import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Navigation, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PractitionersMap() {
  const { user } = useAuth();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  // Fetch practitioners with locations
  const { data: practitioners = [], isLoading } = useQuery({
    queryKey: ['/api/practitioners-with-locations', { location: searchLocation }],
    enabled: !!user,
  });

  // South African provinces for filtering
  const provinces = [
    'Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State',
    'KwaZulu-Natal', 'North West', 'Gauteng', 'Mpumalanga', 'Limpopo'
  ];

  const filteredPractitioners = practitioners.filter((practitioner: any) => {
    const matchesSearch = !searchLocation || 
      practitioner.practiceCity?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      practitioner.location?.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesProvince = !selectedProvince || 
      practitioner.practiceProvince === selectedProvince ||
      practitioner.location === selectedProvince;
    
    return matchesSearch && matchesProvince;
  });

  // Generate Google Maps URL with multiple locations
  const generateMapUrl = () => {
    if (filteredPractitioners.length === 0) return '#';
    
    // Create a search query for South African healthcare practitioners
    const baseQuery = 'healthcare+practitioners+south+africa';
    
    if (searchLocation) {
      return `https://www.google.com/maps/search/${baseQuery}+${encodeURIComponent(searchLocation)}`;
    }
    
    if (selectedProvince) {
      return `https://www.google.com/maps/search/${baseQuery}+${encodeURIComponent(selectedProvince)}`;
    }
    
    return `https://www.google.com/maps/search/${baseQuery}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Find Practitioners
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Locate healthcare professionals near you in South Africa
                </p>
              </div>
            </div>
            <Button 
              onClick={() => window.open(generateMapUrl(), '_blank')}
              className="bg-primary hover:bg-primary/90"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filters */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
                <CardDescription>
                  Find practitioners by location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by city or area..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Province
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found {filteredPractitioners.length} practitioner(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practitioners Directory</CardTitle>
                <CardDescription>
                  Connect with healthcare professionals in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading practitioners...</p>
                  </div>
                ) : filteredPractitioners.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No practitioners found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search criteria or check back later as more practitioners join the platform.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredPractitioners.map((practitioner: any) => (
                        <div key={practitioner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {practitioner.firstName} {practitioner.lastName}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {practitioner.role}
                                </Badge>
                                {practitioner.isOnline && (
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                {practitioner.practiceAddress && (
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                      {practitioner.practiceAddress}, {practitioner.practiceCity}, {practitioner.practiceProvince}
                                    </span>
                                  </div>
                                )}
                                
                                {practitioner.practicePhone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{practitioner.practicePhone}</span>
                                  </div>
                                )}
                                
                                {practitioner.email && (
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{practitioner.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              {practitioner.practiceAddress && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const address = `${practitioner.practiceAddress}, ${practitioner.practiceCity}, ${practitioner.practiceProvince}, South Africa`;
                                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
                                  }}
                                >
                                  <Navigation className="h-4 w-4 mr-1" />
                                  Directions
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}