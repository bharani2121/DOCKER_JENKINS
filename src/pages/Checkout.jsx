import React from "react";
import StripeCheckout from "react-stripe-checkout";
// import "./Checkout.css";

const Checkout = () => {

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>


          <StripeCheckout
            stripeKey="pk_test_Your_Stripe_Key_Here" // your publishable key
            // token={handleToken}
            name="Handloom Store Payment"
            // amount={totalPrice * 100} // Stripe expects amount in paise
            currency="INR"
          >
            <button className="payment-button">
              Proceed to Payment
            </button>
          </StripeCheckout>
          </div>
  );
};

export default Checkout;