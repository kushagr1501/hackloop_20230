<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>Razorpay Web-Integration</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>

</head>
<style>
	body {
		height: 100vh;
		width: 100%;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: Arial, sans-serif;
	}

	.container {
		margin: auto;
		padding: 20px;
		width: 80%;
		max-width: 400px;
		background-color: pink;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2 {
		text-align: center;
		font-size: 1.5em;
	}

	label {
		margin-bottom: 5px;
	}

	input {
		width: 100%;
		padding: 8px;
		margin-bottom: 15px;
		box-sizing: border-box;
	}

	button {
		padding: 10px;
		cursor: pointer;
		background-color: #2300a3;
		color: white;
		border: none;
		border-radius: 5px;
		margin-top: 10px; /* Added margin-top */
	}
</style>

<body>
	<div class="container" id="paymentContainer">

		<h2>MAINTENANCE BILL</h2>
		<label for="name">NAME:</label>
		<input type="text" required>

		<label for="DOOR NO:">DOOR NO:</label>
		<input type="text" required>

		<p>RS 1000</p>

		<form class="pay-form">
			<input type="hidden" name="name" value="paying bill">
			<input type="hidden" name="amount" value="0110">
			<input type="hidden" name="description" value="paying bill">
			<input type="submit" value="Pay Now">
		</form>
	</div>
	<div id="paymentSuccessMessage" style="display: none; text-align: center; color: green; margin-top: 20px;">
		No dues remaining. Payment successful!🙂
	</div>
	<div id="paymentFailureMessage" style="display: none; text-align: center; color: red; margin-top: 20px;">
		Payment unsuccessful!😞
		<button id="retryButton">Retry</button>
	</div>

</body>

</html>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
	$(document).ready(function () {
		$('.pay-form').submit(function (e) {
			e.preventDefault();

			var formData = $(this).serialize();

			$.ajax({
				url: "/createOrder",
				type: "POST",
				data: formData,
				success: function (res) {
					if (res.success) {
						var options = {
							"key": "" + res.key_id + "",
							"amount": "" + res.amount + "",
							"currency": "INR",
							"name": "" + res.product_name + "",
							"description": "" + res.description + "",
							"image": "https://www.the-sun.com/wp-content/uploads/sites/6/2022/11/da5053e2-ebcc-42af-80f4-2433d01697ed.jpg?strip=all&quality=100&w=1920&h=1440&crop=1",
							"order_id": "" + res.order_id + "",
							"handler": function (response) {
								alert("Payment Succeeded");
							},
							"prefill": {
								"contact": "" + res.contact + "",
								"name": "" + res.name + "",
								"email": "" + res.email + ""
							},
							"notes": {
								"description": "" + res.description + ""
							},
							"theme": {
								"color": "#2300a3"
							}
						};
						var razorpayObject = new Razorpay(options);
						razorpayObject.on('payment.failed', function (response) {
							alert("Payment Failed");
							$('#paymentFailureMessage').show();
							$('#paymentSuccessMessage').hide();
						
						});
						razorpayObject.open();
					}
					else {
						alert(res.msg);
					}
				}
			}).done(function (res) {
				if (res.success) {
					$('#paymentContainer').remove();
					$('#paymentSuccessMessage').show();
				} else {
					alert(res.msg);
					$('#paymentFailureMessage').show();
				}
			}).fail(function () {
				alert('Failed to process payment. Please try again.');
				
			});
		});

		// Retry button click event
		$('#retryButton').click(function () {
			location.reload();
		});
	});
</script>
