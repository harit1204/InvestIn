import matplotlib.pyplot as plt
plt.switch_backend('QtAgg')

# Get the revenue data for the past 5 months
revenue = [10000, 12000, 15000, 17000, 9000]

# Set the x-axis labels
x_axis_labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"]

# Plot the graph
plt.plot(revenue, marker="o", linestyle="-")

# Set the title and x-axis label
plt.title("Revenue for the Past 5 Months")
plt.xlabel("Month")

# Set the y-axis label
plt.ylabel("Revenue")

plt.savefig("linegraph.png")

# Set the x-axis ticks
plt.xticks(ticks=range(5), labels=x_axis_labels)

# Show the plot
plt.show()
