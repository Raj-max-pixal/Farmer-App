package com.agridirect

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent { AgriDirectMobile() }
  }
}

@Composable
fun AgriDirectMobile() {
  var ready by remember { mutableStateOf(false) }
  var role by remember { mutableStateOf("Farmer") }
  var tab by remember { mutableStateOf("Home") }
  var selectedProduct by remember { mutableStateOf<Product?>(null) }

  LaunchedEffect(Unit) { delay(900); ready = true }

  MaterialTheme(colorScheme = lightColorScheme(primary = Green, background = PaleGreen)) {
    if (!ready) Splash()
    else if (selectedProduct != null) ProductDetails(selectedProduct!!, onBack = { selectedProduct = null })
    else Scaffold(
      containerColor = PaleGreen,
      bottomBar = { BottomBar(tab) { tab = it } }
    ) { padding ->
      when (tab) {
        "Explore" -> Marketplace(Modifier.padding(padding), onSelect = { selectedProduct = it })
        "Orders" -> Orders(Modifier.padding(padding))
        "Profile" -> Profile(Modifier.padding(padding), role)
        else -> Home(Modifier.padding(padding), role, onRoleChange = { role = it }, onExplore = { tab = "Explore" }, onSelect = { selectedProduct = it })
      }
    }
  }
}

private val Green = Color(0xFF0F5938)
private val PaleGreen = Color(0xFFF4FBF7)
private val SoftGreen = Color(0xFFEAF7EF)

data class Product(val name: String, val emoji: String, val price: Int, val quantity: Int, val grade: String, val farmer: String, val location: String)

private val products = listOf(
  Product("Tomato", "🍅", 24, 200, "Grade A", "Ramesh Kumar", "Kanyakumari, TN"),
  Product("Carrot", "🥕", 22, 150, "Grade A", "Nagaraj", "Nagercoil, TN"),
  Product("Banana", "🍌", 25, 150, "Grade A", "Selvi", "Kanyakumari, TN"),
  Product("Brinjal", "🍆", 18, 80, "Grade B", "Thiruvattar Agro", "Thiruvattar, TN")
)

@Composable
private fun Splash() {
  Box(Modifier.fillMaxSize().background(Green), contentAlignment = androidx.compose.ui.Alignment.Center) {
    Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
      Text("🌱", fontSize = 52.sp)
      Text("AgriDirect", color = Color.White, fontSize = 30.sp, fontWeight = FontWeight.Bold)
      Text("From Farmer to Buyer", color = Color.White.copy(alpha = .82f), fontSize = 14.sp)
      Text("Fair Price for Everyone", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
    }
  }
}

@Composable
private fun Home(modifier: Modifier, role: String, onRoleChange: (String) -> Unit, onExplore: () -> Unit, onSelect: (Product) -> Unit) {
  LazyColumn(modifier.fillMaxSize().padding(horizontal = 18.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
    item {
      Spacer(Modifier.height(12.dp))
      Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Column { Text("Good morning, Ramesh", fontSize = 13.sp, color = Color.Gray); Text("Kanyakumari, TN", fontWeight = FontWeight.Bold, fontSize = 18.sp) }
        Text("🔔", fontSize = 23.sp)
      }
      Spacer(Modifier.height(16.dp))
      OutlinedTextField(value = "", onValueChange = {}, readOnly = true, placeholder = { Text("Search products, farmers, buyers...") }, modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.medium, leadingIcon = { Text("⌕", fontSize = 22.sp) })
      Spacer(Modifier.height(16.dp))
      Card(colors = CardDefaults.cardColors(containerColor = Green), shape = MaterialTheme.shapes.large, modifier = Modifier.fillMaxWidth().clickable { onExplore() }) {
        Row(Modifier.padding(18.dp), verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
          Column(Modifier.weight(1f)) { Text("Fresh produce", color = Color.White, fontSize = 23.sp, fontWeight = FontWeight.Bold); Text("Direct from farmers", color = Color.White.copy(alpha = .85f)); Spacer(Modifier.height(12.dp)); Text("Explore marketplace  ›", color = Color.White, fontWeight = FontWeight.Bold) }
          Text("🥬", fontSize = 58.sp)
        }
      }
    }
    item {
      Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) { Text("Categories", fontWeight = FontWeight.Bold, fontSize = 18.sp); Text("View all", color = Green, fontSize = 13.sp) }
      Spacer(Modifier.height(10.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) { listOf("🥬" to "Vegetables", "🍊" to "Fruits", "🌾" to "Grains", "🥛" to "Dairy").forEach { (icon, label) -> Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) { Box(Modifier.size(58.dp).background(SoftGreen, MaterialTheme.shapes.medium), contentAlignment = androidx.compose.ui.Alignment.Center) { Text(icon, fontSize = 27.sp) }; Spacer(Modifier.height(5.dp)); Text(label, fontSize = 11.sp) } } }
    }
    item { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) { Text("Top deals", fontWeight = FontWeight.Bold, fontSize = 18.sp); Text("View all", color = Green, fontSize = 13.sp, modifier = Modifier.clickable { onExplore() }) } }
    items(products.take(2)) { product -> ProductCard(product, onClick = { onSelect(product) }) }
    item { Text("Your mode", fontWeight = FontWeight.Bold, fontSize = 15.sp); Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { FilterChip(selected = role == "Farmer", onClick = { onRoleChange("Farmer") }, label = { Text("Farmer") }); FilterChip(selected = role == "Buyer", onClick = { onRoleChange("Buyer") }, label = { Text("Buyer") }) } }
    item { Spacer(Modifier.height(10.dp)) }
  }
}

@Composable
private fun Marketplace(modifier: Modifier, onSelect: (Product) -> Unit) {
  Column(modifier.fillMaxSize()) { Text("Fresh marketplace", fontSize = 24.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(18.dp)); LazyColumn(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 18.dp, vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) { items(products) { ProductCard(it, onClick = { onSelect(it) }) } } }
}

@Composable
private fun Orders(modifier: Modifier) {
  Column(modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
    Text("Orders & delivery", fontSize = 24.sp, fontWeight = FontWeight.Bold)
    Text("Track your produce from farm to doorstep", color = Color.Gray)
    Card(Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = Color.White)) {
      Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
          Column { Text("Tomato", fontWeight = FontWeight.Bold, fontSize = 18.sp); Text("200 kg · Grade A", color = Color.Gray, fontSize = 13.sp) }
          Text("₹4,900", color = Green, fontWeight = FontWeight.Bold)
        }
        Text("On the way", color = Green, fontWeight = FontWeight.Bold)
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
          listOf("Placed", "Processing", "Picked up", "On the way", "Delivered").forEach { stage ->
            Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) { Box(Modifier.size(12.dp).background(if (stage == "Delivered") Color.LightGray else Green, androidx.compose.foundation.shape.CircleShape)); Spacer(Modifier.height(5.dp)); Text(stage, fontSize = 9.sp, color = Color.Gray) }
          }
        }
        Divider()
        Text("Ravi Logistics · Tracking #FL-321456", color = Color.Gray, fontSize = 12.sp)
      }
    }
  }
}

@Composable
private fun ProductCard(product: Product, onClick: () -> Unit) {
  Card(Modifier.fillMaxWidth().clickable { onClick() }, colors = CardDefaults.cardColors(containerColor = Color.White)) { Row(Modifier.padding(12.dp), verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) { Box(Modifier.size(78.dp).background(SoftGreen, MaterialTheme.shapes.medium), contentAlignment = androidx.compose.ui.Alignment.Center) { Text(product.emoji, fontSize = 40.sp) }; Spacer(Modifier.width(14.dp)); Column(Modifier.weight(1f)) { Text(product.name, fontWeight = FontWeight.Bold, fontSize = 17.sp); Text("${product.grade} · ${product.quantity} kg", color = Color.Gray, fontSize = 12.sp); Text(product.location, color = Color.Gray, fontSize = 12.sp); Spacer(Modifier.height(5.dp)); Text("₹${product.price}/kg", color = Green, fontWeight = FontWeight.Bold, fontSize = 16.sp) }; Text("›", color = Green, fontSize = 25.sp) } }
}

@Composable
private fun ProductDetails(product: Product, onBack: () -> Unit) {
  Column(Modifier.fillMaxSize().background(Color.White)) { Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) { Text("‹", fontSize = 32.sp, modifier = Modifier.clickable { onBack() }); Text("♡", fontSize = 28.sp) }; Box(Modifier.fillMaxWidth().height(220.dp).background(SoftGreen), contentAlignment = androidx.compose.ui.Alignment.Center) { Text(product.emoji, fontSize = 110.sp) }; Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) { Column { Text(product.name, fontSize = 26.sp, fontWeight = FontWeight.Bold); Text("${product.grade} · ${product.quantity} kg", color = Color.Gray) }; Text("₹${product.price}/kg", color = Green, fontWeight = FontWeight.Bold, fontSize = 20.sp) }; Text("📍 ${product.location}"); Divider(); Text("About this produce", fontWeight = FontWeight.Bold); Text("Fresh produce harvested this week and supplied directly by a verified farmer.", color = Color.Gray); Spacer(Modifier.height(10.dp)); Button(onClick = {}, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = Green)) { Text("Buy now") } } }
}

@Composable
private fun Profile(modifier: Modifier, role: String) { Column(modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) { Text("Profile", fontSize = 24.sp, fontWeight = FontWeight.Bold); Card(colors = CardDefaults.cardColors(containerColor = Green), modifier = Modifier.fillMaxWidth()) { Column(Modifier.padding(20.dp)) { Text("Ramesh Kumar", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold); Text("$role · Verified member", color = Color.White.copy(alpha = .8f)); Spacer(Modifier.height(18.dp)); Text("12 listings     8 orders     4.8 rating", color = Color.White, fontWeight = FontWeight.SemiBold) } }; listOf("My Products", "Order History", "Earnings", "Settings", "Help & Support").forEach { label -> Card(Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = Color.White)) { Row(Modifier.fillMaxWidth().padding(17.dp), horizontalArrangement = Arrangement.SpaceBetween) { Text(label, fontWeight = FontWeight.SemiBold); Text("›", color = Green) } } } } }

@Composable
private fun BottomBar(selected: String, onSelect: (String) -> Unit) { NavigationBar(containerColor = Color.White) { listOf("Home" to "⌂", "Explore" to "⌕", "Orders" to "◷", "Profile" to "◯").forEach { (label, icon) -> NavigationBarItem(selected = selected == label, onClick = { onSelect(label) }, icon = { Text(icon, fontSize = 22.sp) }, label = { Text(label, fontSize = 11.sp) }) } } }
