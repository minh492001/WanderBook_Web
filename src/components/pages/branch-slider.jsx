import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllBranches } from '../utils/ApiFunctions';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import '../styles/branches-section.css';

const BranchesSection = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getAllBranches();
                setBranches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // eslint-disable-next-line react/prop-types
    const CustomPrevArrow = ({ className, onClick }) => (
        <button
            className={`${className} custom-arrow custom-prev-arrow`}
            onClick={onClick}
            aria-label="Previous slide"
        >
            <ArrowLeftCircle className="w-10 h-10" />
        </button>
    );

    // eslint-disable-next-line react/prop-types
    const CustomNextArrow = ({ className, onClick }) => (
        <button
            className={`${className} custom-arrow custom-next-arrow`}
            onClick={onClick}
            aria-label="Next slide"
        >
            <ArrowRightCircle className="w-10 h-10" />
        </button>
    );

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <section id="branches" className="mb-16 scroll-mt-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Exquisite Locations</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading branches...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : branches.length > 0 ? (
                <div className="relative px-12 md:px-0">
                    <Slider {...settings}>
                        {branches.map((branch) => (
                            <div key={branch.id} className="px-2">
                                <div className="relative branch-card group">
                                    <div className="branch-card-image">
                                        <img
                                            className="h-64 w-full object-cover"
                                            src={branch.image || "/default-placeholder.jpg"}
                                            alt={branch.branchName || "Branch Image"}
                                        />
                                    </div>
                                    <div className="branch-card-overlay absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                        <Link
                                            to={`/branch/${branch.id}`}
                                            className="explore-button text-white text-lg font-semibold bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700"
                                        >
                                            Explore {branch.branchName || "Branch"}
                                        </Link>
                                    </div>
                                    <div className="branch-card-info absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                                        <h3 className="font-bold text-xl mb-2">{branch.branchName || "Unnamed Branch"}</h3>
                                        <p className="text-sm">{branch.city || "Unknown City"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <p className="text-center text-gray-500">No branches available at the moment.</p>
            )}
        </section>
    );
};

export default BranchesSection;

