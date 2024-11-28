import React, { useEffect } from 'react';
import './Styles/RefundPolicy.css';

// Define the refund policy details with a playful and detailed tone
const policies = {
  noReturn: {
    title: "🚫 No Return Policy",
    description: (
      <p>
        Oops, looks like this product comes with a "No Return" policy! But don’t worry, this only applies after your delivery. Once the product is in your hands, it’s yours to keep! Please double-check all details and specifications before finalizing your purchase to make sure it’s the right fit for you.
      </p>
    ),
  },
  sevenDaysReplacement: {
    title: "🔄 7-Day Replacement Policy",
    description: (
      <>
        <p>
          No need to stress! If you happen to receive a product that’s defective, broken, or just plain wrong, you’ve got 7 days from the delivery date to initiate a replacement request. We’ll send you a brand-new item as quickly as possible. (Replacement typically takes about 10-15 working days.)
        </p>
        <p>
          And just a quick heads-up: <strong>Our working days are Monday through Saturday</strong>, so Sundays are our well-deserved rest days—please don’t count them when timing your request.
        </p>
      </>
    ),
    reasons: [
      "😱 Received the wrong product",
      "🛠️ Received a defective product",
      "💥 Received a broken product",
    ],
  },
  sevenDaysReturn: {
    title: "🔙 7-Day Return Policy",
    description: (
      <>
        <p>
          We want you to be 100% happy with your purchase! If for any reason you’re not loving your product, you’ve got 7 days to start the return or replacement process. We’ll arrange a pickup from your location within 7 working days, and your refund will be processed within 7-10 working days after the product is picked up.
        </p>
        <p>
          Just remember, <strong>working days</strong> are Monday through Saturday—Sundays are when we recharge, so please don't include them when calculating your return timeline.
        </p>
      </>
    ),
    reasons: [
      "😱 Received the wrong product",
      "🛠️ Received a defective product",
      "💥 Received a broken product",
      "🤔 Didn't quite love the product",
    ],
  },
  cancellationPolicy: {
    title: "🚫 Cancellation Policy",
    description: (
      <p>
        If you change your mind, no worries! You can cancel your order anytime before it has been processed by the seller. Just go to your orders section in the<strong> User Profile </strong>Page and Press the <b>Cancel Order</b> button!
      </p>
    ),
  },
};

const RefundPolicy = ({ productPolicy }) => {
  const getPolicyDetails = () => {
    switch (productPolicy.current) {
      case 'no_return':
        return policies.noReturn;
      case '7_days_replacement':
        return policies.sevenDaysReplacement;
      case '7_days_return':
        return policies.sevenDaysReturn;
      default:
        return null;
    }
  };

  const policy = getPolicyDetails();

  useEffect(() => {
    return () => {
      productPolicy.current = null;
    };
  }, []);

  // If no specific policy is provided (productPolicy is null or undefined), show the complete policy
  if (!productPolicy || !policy) {
    return (
      <div className="refund-policy">
        <h2>📜 Our Complete Return & Cancellation Policy</h2>
        
        <section>
          <h3>🚫 No Return Policy</h3>
          <p>
            If a product comes with a "No Return" policy, then that means no return is available on that product. But that is applicable only after delivery, that means it will be completely yours to keep! Please make sure you’re 100% sure before your purchase. We want you to be happy, so check everything carefully before clicking that buy button!
          </p>
        </section>

        <section>
          <h3>🔄 7-Day Replacement Policy</h3>
          <p>
            If the product you receive is broken, defective, or simply not what you ordered, you can request a replacement within 7 days of delivery. Your replacement will typically arrive within 10-15 working days.
          </p>
          <ul>
            <li>😱 Received the wrong product</li>
            <li>🛠️ Received a defective product</li>
            <li>💥 Received a broken product</li>
          </ul>
        </section>

        <section>
          <h3>🔙 7-Day Return Policy</h3>
          <p>
            If you're not totally in love with your purchase, you can initiate a return or replacement within 7 days. We’ll pick up the product from your location, and your refund will be processed within 7-10 working days after the pickup.
          </p>
          <ul>
            <li>😱 Received the wrong product</li>
            <li>🛠️ Received a defective product</li>
            <li>💥 Received a broken product</li>
            <li>🤔 Didn't quite love the product</li>
          </ul>
        </section>
        <h3>{policies.cancellationPolicy.title}</h3>
        <div className="policy-description">{policies.cancellationPolicy.description}</div>
        <p>
          <strong>Please note:</strong> The replacement or return of any product is valid only if the product is not damaged or changed by the user. In such cases, a refund may not be processed and the user will be solely responsible for such occurence. Also, <b>Please note</b> that the seller retains the right to deny a replacement request if the product is determined to be in its original condition, free of defects, and not damaged during delivery.
        </p>

      </div>
    );
  }

  return (
    <div className="refund-policy">
      <h2>{policy.title}</h2>
      <div className="policy-description">{policy.description}</div>

      {productPolicy.current !== 'no_return' && (
        <>
          <h3>Reasons for {productPolicy.current === '7_days_replacement' ? 'Replacement' : 'Return'}</h3>
          <ul>
            {policy.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </>
      )}

      <h3>{policies.cancellationPolicy.title}</h3>
      <div className="policy-description">{policies.cancellationPolicy.description}</div>

      <p><strong>Note:</strong> All refund processes and return pickups will be handled according to the policies mentioned above. Need help or have questions? Don’t hesitate to reach out to us—we’re always happy to assist you! 😄</p>
    </div>
  );
};

export default RefundPolicy;
