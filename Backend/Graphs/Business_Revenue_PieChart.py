import matplotlib.pyplot as plt
plt.switch_backend('QtAgg')

# Get the revenue data for the past 5 months
revenue = [10000, 12000, 15000, 17000, 9000]

x_axis_labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"]

plt.plot(revenue, marker="o", linestyle="-")

plt.title("Revenue for the Past 5 Months")


plt.pie(revenue, labels=x_axis_labels, autopct='%1.2f%%')

plt.savefig("piechart.png")

plt.show()
