import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'; // Import LoginPage
import AccountPage from './components/AccountPage'; // Import AccountPage
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import ShowtimeList from './components/ShowtimeList';
import ShowtimeForm from './components/ShowtimeForm';
import AccountForm from './components/AccountForm'; // Hoặc đúng đường dẫn của bạn
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TheaterList from './components/TheaterList';
import TheaterForm from './components/TheaterForm';
import ScreenList from './components/ScreenList';
import ScreenForm from './components/ScreenForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import AddUserForm from './components/AddUserForm';
import AdminList from './components/AdminList'; 
import AdminForm from './components/AdminForm'; // Hoặc đúng đường dẫn của bạn
import AddAdminForm from './components/AddAdminForm'; 
import SetupSeatForm from './components/SetupSeatForm'; // Hoặc đúng đường dẫn của bạn
import SeatPriceList from './components/SeatPriceList';
import SeatPriceForm from './components/SeatPriceForm';
import TheaterBrandList from './components/TheaterBrandList';
import FoodList from './components/FoodList'; 
import VoucherList from './components/VoucherList';
import FoodForm from './components/FoodForm';
import PriceAdjustment from './components/PriceAdjustmentList';
import RevenueForm from './components/RevenueForm'; 
import CastList from './components/CastList'; 
import DirectorList from './components/DirectorList';
import UserBookingList from './components/UserBookingList';

import FullScreenLoader from './components/FullScreenLoader'; 
import Pagination from './components/Pagination';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Sử dụng MainLayout để bao bọc tất cả các route */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} /> {/* Thêm route cho LoginPage */}
              <Route path="/account" element={<AccountPage />} /> {/* Thêm route cho AccountPage */}
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/add" element={<MovieForm />} />
              <Route path="/movies/edit/:id" element={<MovieForm />} />
              <Route path="/showtimes" element={<ShowtimeList />} />
              <Route path="/showtimes/add" element={<ShowtimeForm />} />
              <Route path="/showtimes/edit/:id" element={<ShowtimeForm />} />
              <Route path="/accounts/add" element={<AccountForm />} />
              <Route path="/theaters" element={<TheaterList />} />
              <Route path="/theaters/add" element={<TheaterForm />} />
              <Route path="/theaters/edit/:id" element={<TheaterForm />} />
              <Route path="/screens" element={<ScreenList />} />
              <Route path="/screens/add" element={<ScreenForm />} />
              <Route path="/screens/edit/:id" element={<ScreenForm />} />
              <Route path='/accounts/admin' element={<AccountForm />} />
              <Route path='/accounts/user' element={<UserList />} />
              <Route path='/accounts/user/add' element={<AddUserForm />} />
              <Route path='/accounts/user/edit/:id' element={<UserForm />} />
              <Route path='/accounts/admins' element={<AdminList />} />
              <Route path='/accounts/admins/add' element={<AddAdminForm />} />
              <Route path='/accounts/admins/edit/:id' element={<AdminForm />} />
              <Route path='/screens/:id/setupSeats' element={<SetupSeatForm />} />
              <Route path='/seatPrices' element={<SeatPriceList />} />
              <Route path='/seatPrices/add' element={<SeatPriceForm />} />
              <Route path='/seatPrices/edit/:id' element={<SeatPriceForm />} />
              <Route path='/theaterBrands' element={<TheaterBrandList />} />
              <Route path='/foods' element={<FoodList />} />
              <Route path='/vouchers' element={<VoucherList />} />
              <Route path='/priceAdjustments' element={<PriceAdjustment />} />
              <Route path='/test' element={<Pagination />} />
              <Route path='/revenue' element={<RevenueForm />} />
              <Route path='/casts' element={<CastList />} />
              <Route path='/directors' element={<DirectorList />} />
              <Route path="/accounts/user/:id/bookings" element={<UserBookingList />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;