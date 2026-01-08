import about1 from '../img/about-1.jpg';
import about2 from '../img/about-2.jpg';
import about3 from '../img/about-3.jpg';
import about4 from '../img/about-4.jpg';

const Registration = () => {
    return(
        <div className="container-xxl py-5">
        <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 className="section-title text-center text-primary text-uppercase">Registration Page</h6>
                <h1 className="mb-5">Exercise for your <span className="text-primary text-uppercase">Brain</span></h1>
            </div>
            <div className="row g-5">
                <div className="col-lg-6">
                    <div className="row g-3">
                        <div className="col-6 text-end">
                            <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src={about1} style={{marginTop : 25 + '%'}}/>
                        </div>
                        <div className="col-6 text-start">
                            <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src={about2}/>
                        </div>
                        <div className="col-6 text-end">
                            <img className="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src={about3}/>
                        </div>
                        <div className="col-6 text-start">
                            <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src={about4}/>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="wow fadeInUp" data-wow-delay="0.2s">
                        <form action="postAdd.php" method="post" enctype="multipart/form-data">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select className="form-select" name="type" id="select1">
                                          <option value="dog">Dog 🐕</option>
                                          <option value="cat">Cat 🐱</option>
                                          <option value="rabbit">Rabbit 🐇</option>
                                          <option value="fish">Fish 🦈</option>
                                          <option value="rat">Rat 🐀</option>
                                        </select>
                                        <label for="select1">Select Type</label>
                                      </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" name="breed" id="name" placeholder="Your Name"/>
                                        <label for="name">Breed name</label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" name="name" id="email" placeholder="Your Email"/>
                                        <label for="email">Pet Name</label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" name="price" id="email" min="1" max="1000000" placeholder="Your Email"/>
                                        <label for="email">Price of pet</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating date" id="date4" data-target-input="nearest">
                                        <input type="file" name="fileToUpload" id="fileToUpload" className="form-control" />
                                        <label for="fileToUpload">Choose image</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating date" id="date3" data-target-input="nearest">
                                        <input type="number" className="form-control" name="years" min="0" max="20" id="checkin" placeholder="Check In" data-target="#date3"/>
                                        <label for="checkin">Age (only years)</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating date" id="date4" data-target-input="nearest">
                                        <input type="number" className="form-control" id="checkout" name="months" min="0" max="11" placeholder="Check Out" data-target="#date4" />
                                        <label for="checkout">Age (only months)</label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" name="name" id="email" placeholder="Your Email"/>
                                        <label for="email">Pet Name</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary w-100 py-3" type="submit">Put it up for sale</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Registration;
