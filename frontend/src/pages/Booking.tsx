
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, MapPin, Star, Check, Wifi, Car, Coffee, Dumbbell } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchHotels, createAppointment, Hotel, CreateAppointmentData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-lobby.jpg";

const Booking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    roomType: '',
    specialRequests: ''
  });

  const { data: hotels, isLoading, error, refetch } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
    retry: 1,
  });

  const bookingMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast({
        title: "Booking Confirmed!",
        description: `Your reservation at ${selectedHotel?.name} has been received.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const openBookingModal = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
    setBookingSuccess(false);
    setFormData({
      guestName: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      roomType: hotel.roomTypes?.[0] || 'Standard',
      specialRequests: ''
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
    setBookingSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    const bookingData: CreateAppointmentData = {
      hotelId: selectedHotel._id,
      hotelName: selectedHotel.name,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      numberOfGuests: formData.numberOfGuests,
      roomType: formData.roomType,
      specialRequests: formData.specialRequests,
    };

    bookingMutation.mutate(bookingData);
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (selectedHotel) {
      return calculateNights() * selectedHotel.pricePerNight;
    }
    return 0;
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getMinCheckoutDate = () => {
    if (formData.checkInDate) {
      const checkIn = new Date(formData.checkInDate);
      checkIn.setDate(checkIn.getDate() + 1);
      return checkIn.toISOString().split('T')[0];
    }
    return getTodayDate();
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lower.includes('parking') || lower.includes('valet')) return <Car className="w-4 h-4" />;
    if (lower.includes('restaurant') || lower.includes('breakfast') || lower.includes('coffee')) return <Coffee className="w-4 h-4" />;
    if (lower.includes('gym') || lower.includes('fitness')) return <Dumbbell className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[200px] md:h-[250px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Rooms & Suites
          </h1>
          <div className="flex items-center gap-1.5 text-sm">
            <a href="/" className="text-white/70 hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4 text-white/70" />
            <span className="text-primary">Booking</span>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-label mb-4">Our Rooms</span>
            <h2 className="section-title mt-4">Available Hotels & Rooms</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover our collection of exceptional hotels for your next adventure
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-background rounded-2xl overflow-hidden shadow-lg">
                  <Skeleton className="w-full h-56" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load hotels</h3>
              <p className="text-muted-foreground mb-4">Please try again later</p>
              <button onClick={() => refetch()} className="btn-primary">
                Try Again
              </button>
            </div>
          )}

          {/* Hotels Grid */}
          {!isLoading && !error && Array.isArray(hotels) && hotels.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel: Hotel) => (
                <div key={hotel._id} className="bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-border">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.image || 'https://via.placeholder.com/400x300'}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {hotel.rating > 0 && (
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{hotel.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {hotel.availableRooms < 5 && hotel.availableRooms > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        Only {hotel.availableRooms} left!
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location.city}, {hotel.location.country}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities?.slice(0, 4).map((amenity, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities && hotel.amenities.length > 4 && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          +{hotel.amenities.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-foreground">${hotel.pricePerNight}</span>
                        <span className="text-muted-foreground text-sm"> / night</span>
                      </div>
                      <button
                        onClick={() => openBookingModal(hotel)}
                        disabled={hotel.availableRooms < 1}
                        className={`btn-primary px-6 py-2 ${hotel.availableRooms < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {hotel.availableRooms < 1 ? 'Sold Out' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Hotels */}
          {!isLoading && !error && Array.isArray(hotels) && hotels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No hotels available</h3>
              <p className="text-muted-foreground">Please check back later for new listings.</p>
            </div>
          )}

          {/* Fallback: loaded but no data (e.g. API shape changed) */}
          {!isLoading && !error && (!hotels || !Array.isArray(hotels)) && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Could not load hotels</h3>
              <p className="text-muted-foreground mb-4">The server returned unexpected data.</p>
              <button onClick={() => refetch()} className="btn-primary">
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Book Your Stay
            </DialogTitle>
          </DialogHeader>

          {selectedHotel && (
            <>
              {/* Hotel Info */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <img
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{selectedHotel.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedHotel.location.city}, {selectedHotel.location.country}
                  </p>
                  <p className="text-primary font-semibold">${selectedHotel.pricePerNight}/night</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Booking Confirmed!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your reservation at {selectedHotel.name} has been received.
                    Confirmation will be sent to {formData.email}.
                  </p>
                  <button onClick={closeModal} className="btn-primary">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestName">Full Name *</Label>
                      <Input
                        id="guestName"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Guests *</Label>
                      <Input
                        id="numberOfGuests"
                        name="numberOfGuests"
                        type="number"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        min={1}
                        max={20}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDate">Check-in *</Label>
                      <Input
                        id="checkInDate"
                        name="checkInDate"
                        type="date"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOutDate">Check-out *</Label>
                      <Input
                        id="checkOutDate"
                        name="checkOutDate"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={handleInputChange}
                        min={getMinCheckoutDate()}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select value={formData.roomType} onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedHotel.roomTypes?.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requests or preferences..."
                      rows={3}
                    />
                  </div>

                  {calculateNights() > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{calculateNights()} night(s) × ${selectedHotel.pricePerNight}</span>
                        <span>${calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                        <span>Total</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Booking;
