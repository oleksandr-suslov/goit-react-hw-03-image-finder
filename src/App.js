import { Component } from "react";
// import { ToastContainer } from "react-toastify";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import getImagesApi from "./utility/ServiceApi";

// import Loader from "./components/Loader/Loader";
import Button from "./components/Button/Button";
import Modal from "./components/Modal/Modal";
import styles from "./App.css";

var shortid = require("shortid");

export default class App extends Component {
  state = {
    findImage: "",
    images: [],
    page: 1,
    isLoading: false,
    showModal: false,
  };

  componentDidMount() {
    this.searchImages();
  }
  componentDidUpdate(prevProps, prevState) {
    const { findImage, page } = this.state;

    if (prevState.findImage !== findImage) {
      this.searchImages(findImage, 1);
      this.setState({ page: 1 });
    }
    if (prevState.page !== page) {
      this.searchImages(findImage, page);
    }
  }
  handleFormSubmit = (findImage) => {
    this.setState({ findImage });
    console.log(this.state.findImage);
  };

  toggleShowModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  searchImages(findImage = "", page = 1) {
    getImagesApi(findImage, page).then((data) => {
      if (page === 1) {
        this.setState({
          images: data.hits,
        });
      } else {
        this.setState((prevState) => ({
          images: [...prevState.images, ...data.hits],
        }));
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    });
    // .catch((error) => this.setState({ error }))
    // .finally(() => this.setState({ isLoading: false }));
  }
  onButtonNextPage = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };
  render() {
    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery arr={this.state.images} onClick={this.toggleShowModal} />
        {/* <Loader /> */}
        <Button
          type="button"
          name="Load more"
          id={shortid.generate()}
          clickOnBtn={this.onButtonNextPage}
        />
        {this.state.showModal && (
          <Modal onClose={this.toggleShowModal}>
            <img src="#" alt="#" />
          </Modal>
        )}
        {/* <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </div>
    );
  }
}